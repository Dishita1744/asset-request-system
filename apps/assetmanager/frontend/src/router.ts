import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import MyRequests from '@/pages/MyRequests.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/my-requests',
    name: 'MyRequests',
    component: MyRequests,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth guard — uses relative path so Vite proxy forwards the session cookie
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true
  try {
    const res = await fetch('/api/method/frappe.auth.get_logged_user', {
      credentials: 'include',
    })
    const data = await res.json()
    if (res.ok && data.message && data.message !== 'Guest') return true
    return '/login'
  } catch {
    return '/login'
  }
})

export default router
