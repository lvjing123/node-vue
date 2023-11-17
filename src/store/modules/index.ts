// @ts-nocheck
const allModules = import.meta.globEager('./*/index.ts')
const modules = {} as any
Object.keys(allModules).forEach((path) => {
  const fileName = path.split('/')[1]
  modules[fileName] = allModules[path][fileName] || allModules[path].default || allModules[path]
})

export default modules
// 多仓库管理
import user from './user'

export default {
  user,
}