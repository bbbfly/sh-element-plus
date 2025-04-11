<template>
  <!-- <el-text type="info" size="small"> 拖动左上角的小圆点可对其排序 </el-text> -->
  <VueDraggable
    :list="formData"
    :force-fallback="true"
    :animation="200"
    handle=".drag-icon"
    class="m-t-8px"
    item-key="index"
  >
    <template #item="{ element, index }">
      <div >
        <slot :element="element" :index="index"></slot>
      </div>
    </template>
  </VueDraggable>

</template>

<script setup lang="ts">
import {computed} from 'vue'
// 拖拽组件
import VueDraggable from 'vuedraggable'

// 拖拽组件封装
defineOptions({ name: 'Draggable' })

// 定义属性
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default:() => []
  },
  // 数量限制：默认为0，表示不限制
  limit: {
    type: Number,
    default: 0
  }
})
// 定义事件
const emit = defineEmits(['update:modelValue'])
const formData = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

</script>