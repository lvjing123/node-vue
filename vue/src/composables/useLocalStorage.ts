const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
const prefixKey = ''

export const getKey = (key: string) => {
  return `${prefixKey}${key}`.toUpperCase()
}

export const storageSet = (key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) => {
  const stringData = JSON.stringify({
    value,
    expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
  })
  localStorage.setItem(getKey(key), stringData)
}

export const storageRemove = (key: string) => {
  localStorage.removeItem(getKey(key))
}

export const storageGet = (key: string, def: any = null) => {
  const item = localStorage.getItem(getKey(key))
  if (item) {
    try {
      const data = JSON.parse(item)
      const { value, expire } = data
      // 在有效期内直接返回
      if (expire === null || expire >= Date.now()) {
        return value
      }
      storageRemove(key)
    } catch (e) {
      return def
    }
  }
  return def
}