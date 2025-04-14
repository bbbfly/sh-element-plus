import type { VNode, CSSProperties, Component, Ref, VNodeRef } from 'vue'
import type { FormItemProps } from '@element-plus/components/form'
import type { ColProps } from '@element-plus/components/col'

export type Data = {
  data?: any
  item?: FormItem
}

export type Recordable = Record<string, any>

export type RenderFn = (data: Data) => VNode[]

export type Condition = (data: Data) => boolean
export type RenderItem = (data?: Data) => VNode[]

export type ComponentName =
  | 'Radio'
  | 'RadioButton'
  | 'Checkbox'
  | 'CheckboxButton'
  | 'Input'
  | 'Autocomplete'
  | 'InputNumber'
  | 'Select'
  | 'Cascader'
  | 'Switch'
  | 'Slider'
  | 'TimePicker'
  | 'DatePicker'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'TimeSelect'
  | 'SelectV2'
  | 'TreeSelect'
  | 'Upload'
  | 'Button'
  | 'CheckboxGroup'
  | 'RadioGroup'

// 表单内组件配置 如 input select等
export type SlotComponentOptions = {
  tag: ComponentName | Component
  modelField?: string // vModel 绑定的字段
  options?: Recordable[] // select checkbox 等组件选项
  bindAttrs?: {
    movelValue?: unknown // 定义modelValue 后 modelField 不会生效
    'onUpdate:modelValue'?: (...args: any[]) => void
  } & Recordable // element 相关表单组件属性/事件[onEventName]
  slots?: Record<string, (...args: any[]) => VNode[]> // 表单组件的插槽 如select 有 default 放置el-option
} & Recordable

// el-form-item 配置
export type FormItem = {
  ref?: (el: VNodeRef) => void
  col?: Partial<ColProps> // ElCol Attributes
  slots?: {
    before?: RenderFn | string | SlotComponentOptions
    after?: RenderFn | string | SlotComponentOptions
    default?: RenderFn | string | SlotComponentOptions
    label?: RenderFn | string
  }
  condition?: boolean | Ref | Condition // 是否显示该条FormItem 等效v-if
  group?: FormItems // 分组
  renderItem?: RenderItem | string | SlotComponentOptions
  class?: unknown
  style?: CSSProperties
} & Partial<FormItemProps>

export type FormItems = FormItem[]
