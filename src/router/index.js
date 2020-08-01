import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

//路由匹配规则
const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', component: LoginPage },
  { path: '/home', component: Home }
]

//路由对象
const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to: 将要访问的路径， from：从哪个路径跳转来， next： 放行路径, next('url'):强制跳转
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
