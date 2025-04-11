<template>
  <el-c-table 
    :data="data" 
    :columns="columns" 
    :filter-object="filterObject" 
    setting-key="basicTable" 
    user-id='test' 
    :total="filterObject.total" 
    v-model:page-size="filterObject.pageSize"
    @custom-filter-change="onFilterChange"
  >
    <template #age-filter="column">
      <el-radio-group v-model="filterObject[column.prop]">
        <el-radio :value="20">年龄20</el-radio>
        <el-radio :value="18">年龄18</el-radio>
      </el-radio-group>
    </template>
  </el-c-table>
</template>

<script setup lang='tsx'>
import {reactive, shallowRef} from 'vue'
import {Search} from '@element-plus/icons-vue'

const data = [
  { name: '张三', age: 18, sex: '男', address: '北京市' },
  { name: '李四', age: 20, sex: '女', address: '福州市' },
]
const filterObject = reactive<any>({
  total: data.length,
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
        filter: 'age-filter'
      }
    }
  },
  {
    label: '性别',
    prop: 'sex',
    customFilter:{
      filters:[
        {label: '男', value: '男'},
        {label: '女', value: '女'}
      ],
      
      filterMethod:(val) => {
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

const onFilterChange = (val, column) => {
  console.log(val, column)
}
</script>

<style scoped lang='scss'></style>
