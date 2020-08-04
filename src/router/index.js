import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import Home from '../views/Home.vue'
import Workbench from '../views/workbench.vue'
import Project from '../components/allproject/project.vue'
import Manage from '../components/management/setting.vue'
import Usercenter from '../components/usercenter/user.vue'
import NewProject from '../components/newproject/newproject.vue'

Vue.use(VueRouter)

//路由匹配规则
const routes = [
  { path: '/', redirect: 'login' },
  { path: '/login', component: LoginPage },
  {
    path: '/home',
    redirect: '/home/project',
    component: Home,
    children: [
      { path: 'project', component: Project },
      { path: 'management', component: Manage },
      { path: 'user', component: Usercenter },
      { path: 'newproject', component: NewProject }
    ]
  },
  { path: '/workbench', component: Workbench }
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
