import { withInstall } from '@element-plus/utils'
import CTable from './src/c-table.vue'
import type { SFCWithInstall } from '@element-plus/utils'
export const ElCTable: SFCWithInstall<typeof CTable> = withInstall(CTable)
export default ElCTable

export * from './src/types'
