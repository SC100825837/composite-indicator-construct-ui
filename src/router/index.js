import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login/login'
import layout from '@/views/layout/index'
import home from '@/views/home/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/layout',
      name: 'layout',
      component: layout,
      children:[{
        path: '/layout/Graph',
        name: 'Graph',
        component: () => import('@/views/Graph/index'),
      },
      {
        path: '/layout/excel',
        name: 'excel',
        component: () => import('@/views/excel/index'),
      },
      {
        path: '/layout/excelData',
        name: 'excelData',
        component: () => import('@/views/excel/excelData'),
      },
    ]
    }, 
   
    
  ]
})
