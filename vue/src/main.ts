import { createApp } from 'vue'
import App from './App.vue';
import router from '@/router/index'
import i18n from '@/i18n/index'
import { setupStore } from '@/store'
import '@/assets/style/common.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'; //引入样式

const app = createApp(App)
// 挂载仓库，多仓库管理
setupStore(app)
app.use(ElementPlus)
app.use(router).use(i18n).mount('#app')
