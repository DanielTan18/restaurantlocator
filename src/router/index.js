import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import UserLocation from '@/pages/UserLocation'
import Final from '@/pages/Final'
import CloseBuy from '@/pages/CloseBuy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: UserLocation
    },
    {
      path: '/final',
      component: Final
    },
    {
      path: '/close-buy',
      component: CloseBuy
    },
  ]
})
