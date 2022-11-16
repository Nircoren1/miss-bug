// import { createRouter, createWebHashHistory } from 'vue-router'

import bugApp from '../pages/bug-app.cmp.js'
import bugEdit from '../pages/bug-edit.cmp.js'
import bugDetails from '../pages/bug-details.cmp.js'
import loginSignup from '../cmps/login-signup.cmp.js'

const routes = [
  { path: '/', redirect: '/bug' },
  { path: '/bug', component: bugApp },
  { path: '/bug/edit/:bugId?', component: bugEdit },
  { path: '/bug/:bugId', component: bugDetails },
  { path: '/bug/loginSignup', component: loginSignup },
  
]

export const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes })
