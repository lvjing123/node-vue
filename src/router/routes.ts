// 路由采用懒加载的模式

const Login = () => import('@/views/genal/Login.vue')
const Admin = () => import('@/views/admin/Admin.vue')
const ManageOrg = () => import('@/views/manage/ManageOrg.vue')
const NotFound = () => import('@/views/genal/404.vue')

const routes = [
  {
    path: '/',
    component: Admin,
    redirect: '/admin'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/admin',
    component: Admin,
  },
  {
    path: '/manage',
    component: ManageOrg,
  },
  //添加（放在最后）
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

export default routes