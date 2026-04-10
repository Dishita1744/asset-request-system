import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import MyRequests from '../pages/MyRequests.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/my-requests', component: MyRequests, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true
  try {
    const res = await fetch('/api/method/frappe.auth.get_logged_user')
    const data = await res.json()
    if (data.message && data.message !== 'Guest') return true
    return '/login'
  } catch {
    return '/login'
  }
})

export default router
