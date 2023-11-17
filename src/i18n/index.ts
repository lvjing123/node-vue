import common from './common'
import http from './http'
import { useLangStoreWidthOut } from '@/store/modules/lang'
import { createI18n } from 'vue-i18n'

const useLangStore = useLangStoreWidthOut()
const lang = computed(() => useLangStore.getLang)

interface I18NItem {
  zh: string
  en: string
}

const ret: {
  zh: Record<string, Record<string, string>>
  en: Record<string, Record<string, string>>
} = {
  zh: {
    menu: {},
  },
  en: {
    menu: {},
  },
}
const moduleList = [
  common,
  http,
]
const keyList = [
  'common',
  'http'
]
moduleList.forEach((block, blockIndex) => {
  const keyArr = Object.keys(block)
  const blockKey = keyList[blockIndex]
  ret.zh[blockKey] = {}
  ret.en[blockKey] = {}
  keyArr.forEach((key) => {
    ret.zh[blockKey][key] = (block[key as keyof typeof block] as I18NItem).zh
    ret.en[blockKey][key] = (block[key as keyof typeof block] as I18NItem).en
  })
})

const messages = {
  zh: ret.zh,
  en: ret.en,
}

const i18n = createI18n({
  legacy: false, // Composition API mode
  globalInjection: true, // global
  locale: lang.value,
  fallbackLocale: 'en',
  messages,
})

export default i18n
