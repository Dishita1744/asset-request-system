import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

async function init() {
  // Warm up the session — this call seeds the csrftoken cookie in the browser.
  // credentials:'include' ensures cookies are sent/received properly.
  // A 403 here just means guest (not logged in) — the router guard handles redirect.
  await fetch('/api/method/frappe.auth.get_logged_user', {
    credentials: 'include',
  }).catch(() => {})

  createApp(App).use(router).mount('#app')
}

init()
