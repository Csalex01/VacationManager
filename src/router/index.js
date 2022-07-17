import { createRouter, createWebHistory } from 'vue-router'

import Index from '../views/Index.vue'
import Calendar from '../views/Calendar.vue'
import LeaveRequests from '../views/LeaveRequests.vue'
import Signup from '../views/Auth/Signup.vue'
import Login from '../views/Auth/Login.vue'
import Admin from '../views/Admin/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/:pathMatch(.*)',
    //   name: "NotFound",
    //   component: Index
    // },
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/leave_requests',
      name: 'LeaveRequests',
      component: LeaveRequests
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/adminpanel',
      name: 'Admin',
      component: Admin
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
