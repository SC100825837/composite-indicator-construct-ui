import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login/login'
import Layout from '@/view/layout/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Layout',
      name: 'Layout',
      component: Layout
    }
  ]
})
