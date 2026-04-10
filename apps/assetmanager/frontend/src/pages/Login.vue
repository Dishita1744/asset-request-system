<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-100">
      <div class="text-center mb-8">
        <div class="text-4xl mb-2">🖥️</div>
        <h1 class="text-2xl font-bold text-gray-900">AssetPortal</h1>
        <p class="text-sm text-gray-500 mt-1">Sign in to manage your requests</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Administrator"
            @keyup.enter="login"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="login"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p v-if="errorMsg" class="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
          {{ errorMsg }}
        </p>
        <button
          @click="login"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCSRFToken } from '@/utils/api.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  loading.value = true
  errorMsg.value = ''
  try {
    // Use relative path — goes through Vite proxy, sends cookies correctly
    const res = await fetch('/api/method/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken(),
      },
      body: JSON.stringify({ usr: email.value, pwd: password.value }),
    })
    const data = await res.json()
    if (res.ok && data.message === 'Logged In') {
      router.push('/')
    } else {
      errorMsg.value = data.message || 'Invalid credentials. Please try again.'
    }
  } catch {
    errorMsg.value = 'Could not reach the server. Is Frappe running?'
  } finally {
    loading.value = false
  }
}
</script>
