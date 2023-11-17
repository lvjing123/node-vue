import { defineStore } from 'pinia'
import { store } from '@/store'

export interface LangState {
  lang: string
}

export const useLangStore = defineStore({
  id: 'app-i18n',
  state: (): LangState => ({
    lang: 'zh',
  }),
  getters: {
    getLang(): string {
      return this.lang
    },
  },
  actions: {
    setLang(value: string): void {
        this.lang = value
    },
  },
})

// Need to be used outside the setup
export function useLangStoreWidthOut() {
  return useLangStore(store)
}
