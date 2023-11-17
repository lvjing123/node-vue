import { createPinia } from 'pinia'

const store = createPinia()

// @ts-ignore
export function setupStore(app: App<Element>) {
  app.use(store)
}

export { store }