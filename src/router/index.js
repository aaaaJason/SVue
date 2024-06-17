import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue';
import useredit from '../views/useredit.vue';
import storeedit from '../views/storeedit.vue';
import insertstore from '../views/insertstore.vue';
import updatestore from '../views/updatestore.vue';
import insertuser from '../views/insertuser.vue';
import updateuser from '../views/updateuser.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/main',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/useredit',
    name: 'useredit',
    component: useredit
  },
  {
    path: '/storeedit',
    name: 'storeedit',
    component: storeedit
  }
  ,
  {
    path: '/insertstore',
    name: 'insertstore',
    component: insertstore
  },
  {
    path: '/updatestore',
    name: 'updatestore',
    component: updatestore
  },
  {
    path: '/insertuser',
    name: 'insertuser',
    component: insertuser
  },
  {
    path: '/updateuser',
    name: 'updateuser',
    component: updateuser
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
