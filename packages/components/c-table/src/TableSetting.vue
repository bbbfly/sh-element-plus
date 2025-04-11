<template>
  <span class="c-table-setting--label" @click="open">
    <el-icon style="margin-right: 4px"><Setting /></el-icon>
    表设置
    <el-dialog title="表格设置" v-model="visible" width="500px" append-to-body custom-class="c-table-setting--dialog">
      <el-alert title="操作帮助" type="info" show-icon class="c-table-setting__alert">
        <span>取消勾选可隐藏表格项，点击箭头或拖拽表格项可调整排序</span>
      </el-alert>
      <el-scrollbar class="c-table-setting__scroll-list">
        <Draggable :key="renderKey" v-model="columnModel">
          <template #default="{ element, index }">
            <div class="c-table-setting__drag-item" v-if="showColumn(element)">
              <el-checkbox v-model="element.visible" />
              <span class="column-name">{{ element.label }}</span>
              <span class="btn btn-up" v-if="index > 0" @click.stop="swapColumn(index - 1, index)"
                ><el-icon><ArrowUp /></el-icon
              ></span>
              <span
                class="btn btn-down"
                v-if="index < lastDragItemIndex"
                @click.stop="swapColumn(index, index + 1)"
                ><el-icon><ArrowDown /></el-icon
              ></span>
              <span class="btn drag-icon"
                ><el-icon><Operation /></el-icon
              ></span>
            </div>
          </template>
        </Draggable>
      </el-scrollbar>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button @click="reset">恢复默认</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </span>
</template>

<script setup lang="tsx">
import Draggable from './Draggable.vue'
import {PropType,computed, ref} from 'vue'
import { Operation, ArrowDown, ArrowUp, Setting } from '@element-plus/icons-vue'
import ElButton from '@element-plus/components/button'
import ElIcon from '@element-plus/components/icon'
import ElCheckbox from '@element-plus/components/checkbox'
import ElDialog from '@element-plus/components/dialog'
import ElScrollbar from '@element-plus/components/scrollbar'
import ElAlert from '@element-plus/components/alert'
defineOptions({
  inheritAttrs: false,
  name: 'TableSetting'
})
type DragItem = {
  label: string
  visible?: boolean
  index?: number
  [key: string]: any
}
const props = defineProps({
  modelValue: {
    type: Array as PropType<DragItem[]>,
    default: () => []
  }
})
const emit = defineEmits(['change', 'update:modelValue'])
const showColumn = (column: DragItem) => {
  return column.label !== '操作'
}
const hasActionColumn = computed(() => props.modelValue.some((v) => v.label === '操作'))
const lastDragItemIndex = computed(() => {
  if (hasActionColumn.value) {
    return columnModel.value.length - 2
  }
  return columnModel.value.length - 1
})
const columnModel = ref<DragItem[]>([])

const visible = ref(false)
const renderKey = ref(Date.now())
let temp: DragItem[] = [] // 存放 选择列\序号列
const open = () => {
  temp = []
  const list = props.modelValue.map((v, i) => {
    return {
      ...v,
      visible: v.visible ?? true,
      sortIndex: v.index ?? i
    }
  })
  columnModel.value = list.filter((v: any) => {
    const disabled = v.type === 'selection' || v.type === 'index'
    if (disabled) {
      temp.push(v)
    }
    return !disabled
  })
  renderKey.value = Date.now()
  visible.value = true
}
defineExpose({
  open
})

const swapColumn = (index1: number, index2: number) => {
  const temp = columnModel.value[index1]
  columnModel.value[index1] = columnModel.value[index2]
  columnModel.value[index2] = temp
}
const reset = () => {
  const column = columnModel.value.map((v) => {
    v.visible = true
    return v
  })
  column.sort((a: DragItem, b: DragItem) => (a.index ?? 0) - (b.index ?? 0))
  columnModel.value = column
  renderKey.value = Date.now()
}
const submit = () => {
  visible.value = false
  emit('update:modelValue', [...temp, ...columnModel.value])
  emit('change', [...columnModel.value])
}
</script>
