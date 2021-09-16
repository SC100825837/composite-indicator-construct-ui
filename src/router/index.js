import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/login'
import Home from '@/views/Home/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    }, {
      path: '/excel',
      name: 'excel',
      component: () => import('@/views/excel/index'),
    },
  ]
})
