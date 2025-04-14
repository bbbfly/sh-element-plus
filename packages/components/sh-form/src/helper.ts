import type { FormItem, SlotComponentOptions, Data } from './types'
import type { Component, VNode } from 'vue'
// import { isVNode } from 'vue'

// 处理placeholder
export const handlePlaceholder = (
  component: SlotComponentOptions,
  label?: string
) => {
  const { bindAttrs, tag } = component
  const name = (typeof tag === 'string' ? tag : tag.name ?? '').replace(
    /^El/,
    ''
  )

  const textMap = ['Input', 'Autocomplete', 'InputNumber', 'InputPassword']
  const selectMap = [
    'Select',
    'SelectV2',
    'TimePicker',
    'DatePicker',
    'TimeSelect',
    'TimeSelect',
  ]
  if (textMap.includes(name)) {
    return {
      placeholder: bindAttrs?.placeholder ?? '请输入' + label,
    }
  }
  if (selectMap.includes(name)) {
    // 一些范围选择器
    const twoTextMap = [
      'datetimerange',
      'daterange',
      'monthrange',
      'datetimerange',
      'daterange',
    ]
    if (twoTextMap.includes(bindAttrs?.type as string)) {
      return {
        startPlaceholder: bindAttrs?.startPlaceholder ?? '开始时间',
        endPlaceholder: bindAttrs?.endPlaceholder ?? '结束时间',
        rangeSeparator: '-',
      }
    } else {
      return {
        placeholder: bindAttrs?.placeholder ?? '请选择' + label,
      }
    }
  }
  return {}
}

// 获取插槽
export const getSlot = (
  slot: string | Function | Component | unknown,
  ctxSlots: any | Record<string, (...args: any[]) => VNode[]>,
  data: any,
  item: FormItem
) => {
  if (typeof slot === 'string') {
    return ctxSlots[slot]?.({ data, item } as Data)
  }
  if (typeof slot === 'function') {
    return slot({ data, item } as Data)
  }
  return slot
}
