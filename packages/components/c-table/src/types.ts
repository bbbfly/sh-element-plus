import type { VNode } from 'vue'

export type SlotFn = <T = any>(...args: T[]) => VNode

export type CustomFilter = {
  filterType?: 'checkbox' | 'date' | 'treeSelect' | 'input'
  filters?: any[] // 数据
  filterField?: string // 绑定的字段 默认绑定到 tableColumn 的 prop
  filterProps?: Object // 内部组件绑定的属性
  width?: number // 宽度
  filterMethod?: (value: any, column: TableColumn) => void // change 触发
  slots?: {
    filter?: SlotFn | string // slot 为名称时 需要在template 中 定义 slot
  }
}

export type TableColumn = {
  label?: string
  prop?: string
  minWidth?: number | string
  width?: number | string
  fixed?: 'left' | 'right'
  slots?: {
    default?: SlotFn | string // slot 为名称时 需要在template 中 定义 slot
    header?: SlotFn | string // slot 为名称时 需要在template 中 定义 slot
  }
  customFilter?: CustomFilter // 自定义表头筛选
  children?: TableColumn[]
  index?: number // 表格设置用来默认排序的 (表格设置 自动生成)
  visible?: boolean // 表格设置用来控制是否显示 (表格设置 自动生成)
  showSetting?: boolean // 是否在表头显示 表格设置组件 通常只在 操作列显示
  [key: string]: any
}
