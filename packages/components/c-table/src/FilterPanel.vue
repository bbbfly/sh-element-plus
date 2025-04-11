<template>
  <span class="c-table-filter-panel" :class="{ 'filter-active': isActive }" @click.stop>
    <slot>
      {{ label }}
    </slot>
    <el-popover
      v-model:visible="visible"
      ref="popover"
      placement="bottom-start"
      :width="width"
      trigger="click"
      :show-arrow="false"
      popper-class="c-table-popper"
    >
      <template #reference>
        <!-- <Icon class="filter-icon" icon="svg-icon:filter" :size="12" /> -->
        <span class="filter-icon">
          <svg v-if="!filterIcon" width="11" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.435303 0L10.5006 0C10.8356 0 11.0447 0.36499 10.8793 0.65625L7.85364 5.79688L3.08496 5.79688L0.0593262 0.65625C-0.108765 0.36499 0.100342 0 0.435303 0ZM3.67419 9.78906C3.43359 9.78906 3.23938 9.59351 3.23938 9.35156L3.23938 6.67188L7.69641 6.67188L7.69641 9.35156C7.69641 9.59351 7.50232 9.78906 7.26172 9.78906L3.67419 9.78906Z"
              clip-rule="evenodd"
              fill="#999"
              fill-opacity="1"
              fill-rule="evenodd"
            />
          </svg>
          <el-icon v-else><component :is="filterIcon"></component></el-icon>
        </span>
      </template>
      <div class="filter-wrapper">
        <!-- 内置的常用组件，可通过 slot 自定义覆盖 -->
        <slot name="filter">
          <!-- 多选 -->
          <div class="checkbox-wrapper" v-if="filterType === 'checkbox'">
            <el-checkbox-group v-model="filterModel" v-bind="filterProps">
              <el-checkbox v-for="(item, index) in filters" v-bind="item" :key="index" />
            </el-checkbox-group>
          </div>
          <!-- 日期 -->
          <div class="date-picker-wrapper" v-if="filterType === 'date'">
            <el-date-picker
              v-model="filterModel"
              :teleported="false"
              style="width: 100%"
              :clearable="true"
              value-format="YYYY-MM-DD"
              v-bind="filterProps"
            />
          </div>
          <!-- 树 -->
          <div class="tree-wrapper" v-if="filterType === 'treeSelect'">
            <el-tree-select
              v-model="filterModel"
              :teleported="false"
              :filterable="true"
              check-strictly
              :data="filters"
              placement="bottom"
              v-bind="filterProps"
            />
          </div>
          <div class="input-wrapper" v-if="filterType === 'input'">
            <el-input v-model="filterModel" placeholder="请输入" v-bind="filterProps" />
          </div>
        </slot>
      </div>
      <div class="footer">
        <el-button size="small" @click="reset">重置</el-button>
        <el-button type="primary" size="small" @click="submit">筛选</el-button>
      </div>
    </el-popover>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, unref, PropType } from 'vue'
import ElButton from '@element-plus/components/button'
import ElInput from '@element-plus/components/input'
import ElPopover from '@element-plus/components/popover'
import ElTreeSelect from '@element-plus/components/tree-select'
import {ElCheckbox , ElCheckboxGroup} from '@element-plus/components/checkbox'
import ElDatePicker from '@element-plus/components/date-picker'
import ElIcon from '@element-plus/components/icon'
defineOptions({
  name: 'FilterPanel'
})
const props = defineProps({
  modelValue: {
    type: undefined,
    default: undefined
  },
  label: String,
  filterProps: {
    type: Object,
    default: () => ({})
  },
  filterType: {
    type: String,
    default: 'checkbox',
    validator: (value: string) => ['checkbox', 'date', 'treeSelect', 'input'].includes(value)
  },
  filters: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  width: {
    type: Number,
    default: 200
  },
  filterIcon: {
    type: Object,
    default: () => null
  }
})
const visible = ref(false)
const popover = ref()
const filterModel = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const initFilterModelValue = () => {
  filterModel.value = undefined
}

const isActive = computed(() => {
  return Array.isArray(props.modelValue)
    ? (props.modelValue as any[]).length > 0
    : !!(props.modelValue ?? undefined)
})

const emit = defineEmits(['change', 'update:modelValue'])
const submit = () => {
  visible.value = false
  const val = unref(filterModel)
  emit('change', val ?? undefined)
}
const reset = () => {
  initFilterModelValue()
  setTimeout(submit, 50)
}
</script>

