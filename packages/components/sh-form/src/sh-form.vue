<script lang="tsx">

import { withModifiers, defineComponent, PropType, ref, computed, unref } from 'vue'
import type { Component, Ref } from 'vue'
import type { FormItem, FormItems, SlotComponentOptions, ComponentName, Recordable } from './types'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElRow, ElCol, ElForm, ElFormItem, ElOption, ElRadio, ElCheckbox, ElButton } from '@element-plus/components'
import type { FormItemProps, FormProps } from '@element-plus/components/form'
import type { ColProps } from '@element-plus/components/col'
import { handlePlaceholder, getSlot } from './helper'
import { componentMap } from './componentMap'
import { getProp } from '@element-plus/utils'
/**
 * 默认双向绑定到 表单的 prop 如果需要改变建议配置 bindAttrs.modelField = yourBindPropName
 * 1 如果手动双向绑定 即 formItems 中 bindAttrs 里用到 modelValue 属性 modelValue需要是toRef响应式链接、函数、getter、 computed的响应式数据
 * 2 支持动态增删改表单 formItems 需要是响应式数据
 * 3 支持深层数据双向绑定 如 嵌套对象 prop: test.a.b, 数组 prop: test.index | test.0.a
 * 4 组件ref 绑定 (ref) => testRef.value = ref (jsx写法)
 */
function toValue<T>(source: T | (() => T) | Ref<T>): T {
  if (typeof source === 'function') {
    return computed(source as () => T).value // 处理 getter 函数
  } else {
    return unref(source as Ref<T> | T) // 处理 ref 或普通值
  }
}
export default defineComponent({
  name: 'ElShForm',
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array as PropType<FormItems>,
      default: () => []
    },
    gutter: {
      type: Number,
      default: 16
    },
    layout: {
      type: String,
      default: '',
      validator: (value: string) => ['', 'searchForm'].includes(value)
    }
  },
  emits: ['update:model', 'submit', 'reset'],
  setup(props, { attrs, slots: ctxSlots, emit, expose }) {
    // 导出 elFormRef
    const elFormRef = ref<InstanceType<typeof ElForm>>()
    expose({ elFormRef })

    const formModel = computed({
      get() {
        return props.model ?? {}
      },
      set(val) {
        emit('update:model', val)
      }
    })

    const generateFormItems = computed(() => {
      // 带搜索、重置按钮的搜索栏
      if (props.layout === 'searchForm') {
        return [
          {
            style: { flex: 1 },
            group: props.formItems
          },
          {
            group: [
              {
                renderItem: () => {
                  return (
                    <ElCol>
                      <ElButton type="info" icon={Search} nativeType="submit">
                        查询
                      </ElButton>
                      <ElButton icon={Refresh} nativeType="reset">
                        重置
                      </ElButton>
                    </ElCol>
                  )
                }
              }
            ]
          }
        ] as FormItems
      }
      return props.formItems
    })

    const renderFormItemGroup = (formItems: FormItems) => {
      return formItems
        .filter((item) => {
          const { condition } = item as FormItem
          if (typeof condition === 'function') {
            return condition({ data: formModel.value, item })
          }
          return toValue(condition) ?? true
        })
        .map((item, index) => {

          if (item.renderItem) {
            const { renderItem, ...rest } = item
            return getSlot(item.renderItem, ctxSlots, formModel.value, rest as FormItem)
          }
          return renderFormItemWrapper(item as FormItem, index)
        })
    }
    // el-col 包裹渲染
    const renderFormItemWrapper = (item: FormItem, index: number) => {
      const { col, group, ...rest } = item as FormItem
      if (group) {
        const bindColProps = {
          ...col,
          ...rest,
        } as any as ColProps
        return (
          <ElCol
            class="form-item-group"
            style={{ paddingLeft: 0, paddingRight: 0, flex: `0 0 ${col ? '100%' : 'auto'}` }}
            {...bindColProps}
          >
            {renderFormItemGroup(group)}
          </ElCol>
        )
      }

      return <ElCol {...col}>{renderFormItem(rest as FormItem, index)}</ElCol>
    }
    // el-form-item 渲染
    const renderFormItem = (item: FormItem, index: number) => {
      const { slots, ...rest } = item
      const bindFormItem = {
        ...rest,
        component: null
      } as FormItemProps
      return (
        <ElFormItem {...bindFormItem} key={(item.prop || item.label || index) as string}>
          {{
            default: () => {
              if (!slots) return null
              const { before, default: formItemDefault, after } = slots
              const children = [
                before
                  ? (before as SlotComponentOptions).tag
                    ? renderComponent(before as SlotComponentOptions, item, index)
                    : getSlot(before, ctxSlots, formModel.value, rest as FormItem)
                  : null,
                formItemDefault
                  ? (formItemDefault as SlotComponentOptions).tag
                    ? renderComponent(
                      {
                        modelField: item.prop,
                        ...(formItemDefault as SlotComponentOptions)
                      } as SlotComponentOptions,
                      item,
                      index
                    )
                    : getSlot(formItemDefault, ctxSlots, formModel.value, rest as FormItem)
                  : null,
                after
                  ? (after as SlotComponentOptions).tag
                    ? renderComponent(after as SlotComponentOptions, item, index)
                    : getSlot(after, ctxSlots, formModel.value, rest as SlotComponentOptions)
                  : null
              ]

              return children
            },
            label: () => {
              if (slots?.label) {
                return getSlot(slots.label, ctxSlots, formModel.value, rest as FormItem)
              }
              return item.label
            }
          }}
        </ElFormItem>
      )
    }
    // 表单组件渲染
    const renderComponent = (component: SlotComponentOptions, item: FormItem, index: number) => {
      const { label } = item
      const { bindAttrs, slots, options, tag } = component
      const Com = tag ? componentMap[tag as ComponentName] ?? tag : null
      if (!Com) return null
      let modelField = component.modelField
      const customVModel = bindAttrs?.hasOwnProperty('modelValue')
      const slotsMap: Recordable = {
        default: () => renderOptions(tag, options)
      }
      if (slots) {
        Object.assign(slotsMap, {
          ...slots
        })
        if (slots.default) {
          slotsMap.default = () => slots.default({ data: formModel.value, item })
        }
      }
      const bindProps = {
        ...bindAttrs,
        ...handlePlaceholder(component, label)
      }
      if (customVModel) {
        // 自定义双向绑定 modelValue onUpdate:modelValue
        Object.assign(bindProps, {
          modelValue: toValue(bindAttrs?.modelValue)
        })
      } else if (modelField) {
        // modelField 自动双向绑定
        const fieldValue = getProp(formModel.value, modelField)
        Object.assign(bindProps, {
          modelValue: fieldValue.value,
          'onUpdate:modelValue': (val: any) => {
            fieldValue.value = val
          }
        })
      }
      // @ts-ignore
      return <Com {...bindProps}>{{ ...slotsMap }}</Com>
    }

    // 表单组件自带的slots 渲染 如 el-option el-radio
    const renderOptions = (tag: string | Component, options?: Recordable[]) => {
      if (!tag || !options?.length) return null
      const name = ((tag as Component).name ?? tag) as string
      if (name.endsWith('Select')) {
        // @ts-ignore
        return options.map((item, index) => <ElOption key={item.value || index} {...item} />)
      }
      if (name.endsWith('RadioGroup')) {
        return options.map((item, index) => <ElRadio key={item.value || index} {...item} />)
      }
      if (name.endsWith('CheckboxGroup')) {
        return options.map((item, index) => <ElCheckbox key={item.value || index} {...item} />)
      }
      return null
    }

    // 使用表单的原生submit 方法（form中只有一个表单组件 或者 form带有一个button且nativeType=submit属性）
    const submitForm = (e: Event) => {
      emit('submit', e)
    }
    // 使用表单的原生reset 方法 (form 中带有一个button nativeType=reset属性)
    const resetForm = (e: Event) => {
      emit('reset', e)
    }

    const bindFormProps = {
      ...attrs,
      onReset: withModifiers(resetForm, ['prevent']),
      onsubmit: withModifiers(submitForm, ['prevent'])
    } as any as FormProps
    return () => (
      <div class="sh-form">
        <ElForm
          ref={elFormRef}
          {...bindFormProps}
          model={formModel.value}
        >
          <ElRow gutter={props.gutter}>{renderFormItemGroup(generateFormItems.value)}</ElRow>
        </ElForm>
      </div>
    )
  }
})
</script>