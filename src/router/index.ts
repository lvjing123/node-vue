import { createRouter, createWebHashHistory } from "vue-router"
import routes from "./routes"

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes as any,
})


// 路由拦截狗子函数
router.beforeEach((to, from, next) => {
    // 未登陆 跳转到登录页面
    next()
})


export default router