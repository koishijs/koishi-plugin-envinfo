import { Context } from '@koishijs/client'
import type {} from 'koishi-plugin-envinfo/src'
import Status from './status.vue'

export default (ctx: Context) => {
  ctx.slot({
    type: 'status-left',
    component: Status,
  })
}
