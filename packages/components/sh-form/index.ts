import { withInstall } from '@element-plus/utils'
import ShForm from './src/sh-form.vue'
import type { SFCWithInstall } from '@element-plus/utils'

export const ElShForm: SFCWithInstall<typeof ShForm> = withInstall(ShForm)
export default ElShForm

export * from './src/sh-form'
export type { ShFormInstance } from './src/instance'
