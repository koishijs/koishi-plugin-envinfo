import { Context, Dict, Schema, version } from 'koishi'
import { DataService } from '@koishijs/plugin-console'
import { resolve } from 'path'
import { helpers } from 'envinfo'
import which from 'which-pm-runs'

declare module '@koishijs/plugin-console' {
  namespace Console {
    interface Services {
      envinfo: EnvInfo
    }
  }
}

export interface Config {}

export default class EnvInfo extends DataService<Dict<Dict<string>>> {
  static using = ['console'] as const
  static schema: Schema<Config> = Schema.object({})

  private task: Promise<Dict<Dict<string>>>

  constructor(ctx: Context) {
    super(ctx, 'envinfo', { authority: 4 })

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  }

  async _get(): Promise<Dict<Dict<string>>> {
    const [[, OS], [, CPU]] = await Promise.all([
      helpers.getOSInfo(),
      helpers.getCPUInfo(),
    ])
    const agent = which()
    const system = { OS, CPU }
    const binaries = {
      Node: process.versions.node
    }
    if (agent) {
      if (agent.name === 'yarn') {
        agent.name = 'Yarn'
      }
      binaries[agent.name] = agent.version
    }
    const koishi = {
      Core: version,
      Console: require('@koishijs/plugin-console/package.json').version,
    }
    if (process.env.KOISHI_AGENT) {
      const [name, version] = process.env.KOISHI_AGENT.split('/')
      koishi[name] = version
    }
    return { system, binaries, koishi }
  }

  async get() {
    if (!this.task) this.task = this._get()
    return this.task
  }
}
