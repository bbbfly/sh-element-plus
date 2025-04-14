<template>
  <el-sh-form ref="formRef" label-width="100px" v-model:model="data" :form-items="formItems" :rules="rules">
    <template #action-item>
      <el-button @click="reset">重置</el-button>
      <el-button @click="submit" type="primary">提交</el-button>
    </template>
  </el-sh-form>
</template>

<script setup lang='tsx'>
import { reactive, ref } from 'vue'
import type { FormItems } from '@element-plus/components/sh-form'
const formRef = ref()
const data = reactive({

})
const rules = reactive({
  dataRange: [{ required: true, message: '请选择调度时间', trigger: 'change' }]
})
const formItems = ref<FormItems>([
  {
    label: '调度时间',
    prop: 'dataRange',
    slots: {
      default: {
        tag: 'DatePicker',
        bindAttrs: {
          type: 'datetimerange',
          startPlaceholder: '任务下达开始时间',
          endPlaceholder: '任务下达结束时间',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
        }
      },
    }
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    rules: { required: true, message: '请选择', trigger: 'change' },
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
  {
    slots: {
      default: 'action-item'
    }
  }
])
const reset = () => {
  formRef.value.elFormRef.resetFields()
}
const submit = () => {
  formRef.value.elFormRef.validate()
}
</script>

<style scoped lang='scss'></style>
