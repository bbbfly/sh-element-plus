<script lang="tsx">
// @ts-nocheck
import {defineComponent, ref, reactive, computed, watch, PropType, unref} from 'vue'
import {ElTable,ElTableColumn} from '@element-plus/components/table'
import ElPagination from '@element-plus/components/pagination'
import type { TableColumn } from './types'
import TableSetting from './TableSetting.vue'
import { useTableSetting } from './hooks'
import FilterPanel from './FilterPanel.vue'
/**
 * 配置式数据驱动表格
 * @customFilterChange 自定义过滤条件变化时事件
 * v-model:page-size  分页每页显示条数
 * v-model:current-page 当前页数
 * total 总条数
 */
export default defineComponent({
  name: 'ElCTable',
  inheritAttrs: false,
  props: {
    ...ElPagination.props,
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    showPagination: {
      // 是否显示分页
      type: Boolean,
      default: true
    },
    settingKey: String, // 用于存储表格配置的key
    filterObject: {
      // 表头筛选绑定数据
      type: Object,
      default: () => ({})
    },
    searched: Boolean,
    userId: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['update:modelValue', 'update:pageSize', 'update:currentPage', 'customFilterChange'],
  setup(props, ctx) {
    // 导出 el-table 实例
    const elTableRef = ref<InstanceType<typeof ElTable>>()
    ctx.expose({ elTableRef })

    // 表格设置
    const { columns } = useTableSetting(props.columns, props.settingKey, props.userId)
    // const columns = props.columns

    // 渲染 table-column
    const renderDefault = () => {
      return unref(columns)
        .filter((v) => v.visible ?? true)
        .map(renderColumn)
    }

    const renderColumn = (column: TableColumn, index) => {
      const { slots, children, ...rest } = column
      const minWidth = column.type === 'index' || column.type === 'selection' ? 'auto' : 120
      return (
        <ElTableColumn
          key={column.prop || column.type || column.label}
          show-overflow-tooltip={true}
          min-width={minWidth}
          {...rest}
        >
          {{
            header: () => renderTableColumnHeader(column),
            default: (data) => {
              if (children && children.length) {
                return children.map(renderColumn)
              }
              return renderTableColumnDefault(data, column)
            }
          }}
        </ElTableColumn>
      )
    }

    const renderTableColumnDefault = (data, column) => {
      const { slots, formatter, prop } = column
      if (slots?.default) {
        // 使用模板上的插槽
        if (typeof slots.default === 'string') {
          return ctx.slots[slots.default]?.(data)
        }
        // 使用配置项里的插槽
        return slots.default(data)
      }
      // 配置项里的formatter
      if (formatter) {
        return formatter(data.row, data.column, data.row[prop], data.$index)
      }
      return data.row[prop]
    }

    const renderTableColumnHeader = (column) => {
      const { showSetting } = column
      if (showSetting) {
        // 带有表设置功能
        return (
          <div class="cell-setting">
            {renderHeaderCell(column)}
            <TableSetting v-model={columns.value} />
          </div>
        )
      }
      return renderHeaderCell(column)
    }

    const renderHeaderCell = (column) => {
      const { slots, prop, customFilter } = column
      const label = slots?.header
        ? typeof slots.header === 'string'
          ? ctx.slots[slots.header]?.(column)
          : slots.header(column)
        : column.label
      // 带有表头筛选功能
      if (customFilter) {
        const { filterField, filterMethod, slots:filterSlots,  ...rest } = customFilter
        return (
          <FilterPanel
            v-model={props.filterObject[filterField ?? prop]}
            {...rest}
            onChange={(val) => {
              filterMethod ? filterMethod(val, column) : filterChange(val, column)
            }}
          >
            {{
              default: () => label,
              filter: () => {
                if (!filterSlots?.filter) {
                  return null
                }
                if (typeof filterSlots.filter === 'string') {
                  return ctx.slots[filterSlots.filter]?.(column)
                } 
                return filterSlots.filter(column)
              }
            }}
          </FilterPanel>
        )
      }
      return label
    }
    const filterChange = (val: any, column: TableColumn) => {
      ctx.emit('customFilterChange', val, column)
    }

    // empty slot
    const renderEmpty = () => {
      // const noData = new URL('@/assets/imgs/noData.png', import.meta.url).href
      // const noResult = new URL('@/assets/imgs/noResult.png', import.meta.url).href
      // // searched: 用户操作过查询
      // return ctx.slots.empty ? ctx.slots.empty() : <img src={props.searched ? noData : noResult} />
      return ctx.slots.empty ? ctx.slots.empty() : null
    }

    // 分页 v-model
    const pageSizeModel = computed({
      get() {
        return props.pageSize
      },
      set(val) {
        ctx.emit('update:pageSize', val)
      }
    })
    const currentPageModel = computed({
      get() {
        return props.currentPage
      },
      set(val) {
        ctx.emit('update:currentPage', val)
      }
    })

    const renderPagination = () => {
      if (!props.showPagination) return null
      return (
        <div class="pagination-view">
          <span class="total">共 {props.total ?? 0} 条信息</span>
          <ElPagination
            v-model:current-page={currentPageModel.value}
            v-model:page-size={pageSizeModel.value}
            total={props.total ?? 0}
            layout={'prev,pager,next,sizes'}
            pageSizes={props.pageSizes}
          />
        </div>
      )
    }
    return () => (
      <div class="c-table">
        <ElTable
          ref={elTableRef}
          data={props.data}
          border={true}
          height="100%"
          header-cell-class-name="grey-cell"
          {...ctx.attrs}
        >
          {{
            default: () => renderDefault(),
            empty: () => renderEmpty()
          }}
        </ElTable>
        {renderPagination()}
      </div>
    )
  }
})
</script>