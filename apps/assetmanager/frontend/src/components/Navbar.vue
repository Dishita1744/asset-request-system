<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-6">
        <span class="text-lg font-bold text-blue-600 tracking-tight">🖥️ AssetPortal</span>
        <!-- Nav Links -->
        <nav class="flex items-center gap-1">
          <router-link
            to="/"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            Assets
          </router-link>
          <router-link
            to="/my-requests"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive('/my-requests') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            My Requests
          </router-link>
        </nav>
      </div>
      <!-- User + Logout -->
      <div class="flex items-center gap-3">
        <span v-if="currentUser && currentUser !== 'Guest'" class="text-sm text-gray-500">
          {{ currentUser }}
        </span>
        <button
          @click="logout"
          class="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getLoggedUser, getCSRFToken } from '@/utils/api.js'

const router = useRouter()
const route = useRoute()
const currentUser = ref('')

function isActive(path) {
  return route.path === path
}

async function logout() {
  try {
    await fetch('/api/method/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Frappe-CSRF-Token': getCSRFToken() },
    })
  } finally {
    router.push('/login')
  }
}

onMounted(async () => {
  currentUser.value = await getLoggedUser()
})
</script>
