import { buildProps } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'

export const shFormProps = buildProps({} as const)
export type ShFormProps = ExtractPropTypes<typeof shFormProps>

export const shFormEmits = {}
export type ShFormEmits = typeof shFormEmits
