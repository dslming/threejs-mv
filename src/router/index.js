import Vue from 'vue'
import VueRouter from 'vue-router'
import Dennis from '../page/dennis/Dennis.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dennis',
    component: Dennis
  }
]

const router = new VueRouter({
  routes
})

export default router
