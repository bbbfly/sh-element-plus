<template>
  <el-sh-form v-model:model="data" :form-items="formItems" layout="searchForm" @submit="search" @reset="reset">
    <template #date-btn>
      <el-button class="date-btn">本日</el-button>
      <el-button class="date-btn">昨日</el-button>
      <el-button class="date-btn">近三日</el-button>
    </template>
  </el-sh-form>
</template>

<script setup lang='tsx'>
import { reactive, ref } from 'vue'
import type { FormItems } from '@element-plus/components/sh-form'
const data = reactive<any>({

})

const formItems = ref<FormItems>([
  {
    label: '调度时间',
    prop: 'dataRange',
    col: {
      span: 16
    },
    slots: {
      default: {
        tag: 'DatePicker',
        bindAttrs: {
          type: 'datetimerange',
          startPlaceholder: '任务下达开始时间',
          endPlaceholder: '任务下达结束时间',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          style: {
            width: 'calc( 100% - 300px )'
          }
        }
      },
      after: 'date-btn'
    }
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    col: {
      span: 8
    },
    slots: {
      default: {
        tag: 'Select',
        bindAttrs: {
          placeholder: '选择任务分配状态',
          clearable: true
        },
        options: [
          {
            label: '未分配',
            value: '0'
          },
          {
            label: '已分配',
            value: 1
          }
        ]
      },

    }
  },
])

const reset = () => {
  console.log(data)
}
const search = () => {
  console.log(data)
}
</script>

<style scoped lang='scss'></style>
