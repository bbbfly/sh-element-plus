<template>
  <el-sh-form ref="formRef" label-width="100px" v-model:model="data" :form-items="formItems" :rules="rules">
    <template #action-item>
      <el-button @click="showStatusItem = !showStatusItem">{{ showStatusItem ? '隐藏任务状态' : '显示任务状态' }}</el-button>
      <el-button @click="addItem">增加表单项</el-button>
      <el-button @click="submit" type="primary">提交</el-button>
    </template>
  </el-sh-form>
</template>

<script setup lang='tsx'>
import { reactive, ref, computed } from 'vue'
import { Minus } from '@element-plus/icons-vue'
import type { FormItems } from '@element-plus/components/sh-form'
const formRef = ref()
const data = reactive<any>({
  dynamicItems: []
})
const rules = reactive({
  dataRange: [{ required: true, message: '请选择调度时间', trigger: 'change' }]
})
const showStatusItem = ref(true)
const genDynamicItems = () => {
  return data.dynamicItems.map((item, i) => {
    return {
      label: 'item' + (i + 1),
      prop: `dynamicItems.${i}.data`,
      col: {
        span: 6,
      },
      rules: { required: true, message: '请输入' },
      slots: {
        default: {
          tag: 'Input',
          bindAttrs: {
            clearable: true,
          }
        },
        after: (column) => {
          return <el-button icon={Minus} onClick={() => removeItem(i)}></el-button>
        }
      }
    }
  }) as FormItems
}
const formItems = computed<FormItems>(() => [
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
    condition: showStatusItem,
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
  ...genDynamicItems(),
  {
    slots: {
      default: 'action-item'
    }
  }
])

const addItem = () => {
  data.dynamicItems.push({ data: '' })
}
const removeItem = (i: number) => {
  data.dynamicItems.splice(i, 1)
}

const submit = () => {
  formRef.value.elFormRef.validate()
}
</script>

<style scoped lang='scss'></style>
