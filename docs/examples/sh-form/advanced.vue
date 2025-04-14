<template>
  <el-sh-form v-model:model="data" :form-items="formItems">
    <template #date-btn>
      <el-button class="date-btn">本日</el-button>
      <el-button class="date-btn">昨日</el-button>
      <el-button class="date-btn">近三日</el-button>
    </template>
  </el-sh-form>
</template>

<script setup lang='tsx'>
import { reactive, shallowRef, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElShForm, ElCTable, ElDatePicker, ElSelect } from '@element-plus/components'
import type { FormItems } from '@element-plus/components/sh-form'
const data = reactive({

})
const tableData = [
  // { name: '张三', age: 18, sex: '男', address: '北京市' },
  // { name: '李四', age: 20, sex: '女', address: '福州市' },
]
const filterObject = reactive<any>({
  total: tableData.length,
  pageSize: 10,
  pageNo: 1
})
const columns = [
  {
    label: '姓名',
    prop: 'name',
    customFilter: {
      width: 300,
      filterType: 'input',
      filterProps: {
        placeholder: '请输入姓名模糊搜索',
        clearable: true,
      },
      filterIcon: shallowRef(Search),
    }
  },
  {
    label: '年龄',
    prop: 'age',
    customFilter: {
      slots: {
        filter: (column) => {
          return (
            <el-radio-group vModel={filterObject[column.prop]}>
              <el-radio value="20">年龄20</el-radio>
              <el-radio value="18">年龄18</el-radio>
            </el-radio-group>
          )
        }
        // filter: 'age-filter' // 也可以定义插槽名称方式
      }
    }
  },
  {
    label: '性别',
    prop: 'sex',
    customFilter: {
      filters: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ],

      filterMethod: (val) => {
        console.log(val)
      }
    }
  },
  {
    label: '地址',
    prop: 'address',
    showSetting: true
  },
]

const formItems = ref<FormItems>([
  {
    label: '调度时间',
    prop: 'dataRange',
    col: {
      span: 16
    },
    slots: {
      default: {
        tag: shallowRef(ElDatePicker),
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
    rules: { required: true, message: '请选择', trigger: 'change' },
    slots: {
      default: {
        tag: shallowRef(ElSelect),
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
    label: 'CTable',
    slots: {
      default: {
        tag: shallowRef(ElCTable),
        bindAttrs: {
          ref: (ref) => {
            console.log(ref, 'cTableRef')
          },
          columns,
          filterObject,
          data: tableData,
          onCustomFilterChange: (val, column) => {
            console.log(val, column)
          }
        },
        slots: {
          empty: () => '暂无数据  :)',
          // 对应 columns 配置的 filter 插槽名称 'age-filter'
          // 'age-filter': (column) => {
          //   return (
          //     <el-radio-group vModel={filterObject[column.prop]}>
          //       <el-radio value="20">年龄20</el-radio>
          //       <el-radio value="18">年龄18</el-radio>
          //     </el-radio-group>
          //   )
          // }
        },
      }
    }
  }
])
</script>

<style scoped lang='scss'></style>
