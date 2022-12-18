import { Context, Schema, version } from 'koishi'
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

export interface Payload {
  os: string
  cpu: string
  node: string
  manager: {
    name: string
    version: string
  }
  koishi: {
    core: string
    agent: string
  }
}

export interface Config {
}

export default class EnvInfo extends DataService<Payload> {
  static using = ['console'] as const
  static schema: Schema<Config> = Schema.object({})

  private task: Promise<Payload>

  constructor(ctx: Context) {
    super(ctx, 'envinfo', { authority: 4 })

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  }

  async _get(): Promise<Payload> {
    const [os, cpu] = await Promise.all([
      helpers.getOSInfo(),
      helpers.getCPUInfo(),
    ])
    return {
      os,
      cpu,
      node: process.versions.node,
      manager: which(),
      koishi: {
        core: version,
        agent: process.env.KOISHI_AGENT,
      },
    }
  }

  async get() {
    if (!this.task) this.task = this._get()
    return this.task
  }
}
