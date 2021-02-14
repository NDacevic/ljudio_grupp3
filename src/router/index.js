import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Startpage from '../views/Startpage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Startpage',
    component: Startpage
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
