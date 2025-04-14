<template>
  <div>
    <el-card>
      表单数据：{{ data }}
      <div>
        formItemRef: {{ formItemRef }}
      </div>
      datePickerRef: {{ datePickerRef }}
      <div>
        inputRef: {{ inputRef }}
      </div>
      <el-sh-form ref="formRef" label-width="100px" v-model:model="data" :form-items="formItems" :rules="rules">
        <template #action-item>
          <el-button @click="reset">重置</el-button>
          <el-button @click="submit" type="primary">提交</el-button>
        </template>
      </el-sh-form>
    </el-card>


    <el-card>
      在模板中使用定义的slot
      <el-sh-form v-model:model="data" :form-items="formItems2">
        <template #date-label="{ data, item }">自定义label</template>
        <template #date-default="{ data: formData, item }">
          <el-row type="flex" style="flex: 1; flex-wrap:nowrap">
            <el-select v-model="data.type">
              <el-option value="1">类型1</el-option>
              <el-option value="2">类型2</el-option>
            </el-select>
            <el-date-picker style="flex-shrink: 0;" v-model="data[item.prop]" type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
            <el-input v-model="data.remark"></el-input>
          </el-row>
        </template>
      </el-sh-form>

    </el-card>
  </div>
</template>

<script setup lang='tsx'>
import { reactive, ref, toRef, } from 'vue'
import type { FormItems } from '@element-plus/components/sh-form'

const formRef = ref()
const data = reactive({
  type: '',
  remark: ''
})
const rules = reactive({
  dataRange: [{ required: true, message: '请选择调度时间', trigger: 'change' }]
})
const formItemRef = ref()
const datePickerRef = ref()
const inputRef = ref()
// 配置选项
const formItems = ref<FormItems>([
  {
    label: '调度时间',
    prop: 'dateRange',
    ref: (ref) => formItemRef.value = ref,
    slots: {
      before: {
        tag: 'Select',
        modelField: 'type',
        bindAttrs: {
          style: { width: '20%' },
          placeholder: '请选择类型'
        },
        options: [
          { label: '类型1', value: '1' },
          { label: '类型2', value: '2' }
        ]
      },
      default: {
        tag: 'DatePicker',
        // modelField: 'myDateRange' // default 插槽中 modelField 默认为 prop 定义的 dateRange,  
        bindAttrs: {
          ref: (ref) => datePickerRef.value = ref,
          type: 'datetimerange',
          startPlaceholder: '任务下达开始时间',
          endPlaceholder: '任务下达结束时间',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          style: {
            width: '60%'
          }
        }
      },
      after: {
        tag: 'Input',
        bindAttrs: {
          ref: (ref) => inputRef.value = ref,
          modelValue: toRef(data, 'remark'), // 手动绑定数据
          'onUpdate:modelValue': (e) => {
            data.remark = e
          },
          placeholder: '请输入备注',
          style: {
            width: '20%',
          }
        }
      }
    }
  },
  {
    slots: {
      default: 'action-item'
    }
  }
])
// 在模板中使用定义的slot
const formItems2 = ref<FormItems>([
  {
    label: '调度时间',
    prop: 'dateRange',
    slots: {
      label: 'date-label',
      default: 'date-default'
    }
  },
])
const reset = () => {
  formRef.value.elFormRef.resetFields()
}
const submit = () => {
  formRef.value.elFormRef.validate()
}
</script>

<style scoped lang='scss'></style>
