import type { TableColumn } from './types'
import { unref, watch, ref, reactive } from 'vue'
const useCache = () => {
  const wsCache = {
    get(key: string) {
      try {
        const data = JSON.parse(localStorage.getItem(key) as string)
        return data
      } catch (e) {
        return null
      }
    },
    set(key: string, data: any) {
      localStorage.setItem(key, JSON.stringify(data))
    },
    remove(key: string) {
      localStorage.removeItem(key)
    },
  }
  return {
    wsCache,
  }
}

// 表格列排序相关设置-按用户id-保存到本地
type SettingColumn = {
  label: string
  visible?: boolean
  index?: number
} & TableColumn

type PageTable = {
  path: string
  columns: SettingColumn[]
  labels: string
}

type TableSetting = {
  [key: string]: PageTable[]
}
// 如果一个页面有多个表格设置 则需要传入唯一的settingKey防止数据覆盖
export const useTableSetting = (
  data: SettingColumn[],
  settingKey?: string,
  userId?: string | number
) => {
  const path = settingKey ?? ''
  const { wsCache } = useCache()
  const columns = ref<SettingColumn[]>([...unref(data)])
  const settings = reactive<TableSetting>(wsCache.get('cTableSetting') || {})
  const labels = data.map((item) => item.label).join() // 用于判断 原始表格列是否有变化 （如增、删、改变label）
  if (userId && !settings[userId]) {
    settings[userId] = []
  }
  const getPage = () => {
    if (userId) {
      return settings[userId]?.find((item) => item.path === path)
    }
    return null
  }
  watch(
    columns,
    (val: SettingColumn[]) => {
      const saveData = val.map((item) => {
        return { label: item.label, visible: item.visible, index: item.index }
      })
      const page = getPage()
      if (page) {
        page.columns = saveData
        if (page.labels !== labels) {
          page.labels = labels
        }
      } else if (userId) {
        settings[userId]?.push({ path, labels, columns: saveData })
      }
      // 持久化保存到本地
      if (path && userId) {
        wsCache.set('tableSetting', settings)
      }
    },
    { deep: true }
  )
  const page = getPage()
  if (page && page.labels === labels) {
    columns.value = page.columns.map((item) => {
      const v = unref(data).find((v) => v.label === item.label) || {}
      return {
        ...v,
        visible: item.visible ?? true,
        index: item.index,
      } as SettingColumn
    })
  } else {
    columns.value = unref(data).map((item: SettingColumn, index) => {
      return {
        ...item,
        index,
        visible: true,
      }
    })
  }

  return {
    columns,
  }
}
