<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="max-w-5xl mx-auto px-6 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">My Requests</h1>
        <p class="text-sm text-gray-500 mt-1">Track the status of your asset requests</p>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-400">
        Loading your requests...
      </div>
      <div v-else-if="requests.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-lg font-medium">No requests yet</p>
        <p class="text-sm mt-1">Head to the Assets page to make your first request.</p>
        <router-link
          to="/"
          class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Browse Assets →
        </router-link>
      </div>
      <div v-else class="grid gap-4">
        <div
          v-for="req in requests"
          :key="req.name"
          class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="font-semibold text-gray-800">{{ req.asset }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ req.reason || 'No reason provided' }}</p>
            </div>
            <span
              class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold"
              :class="{
                'bg-yellow-100 text-yellow-700': req.status === 'Pending',
                'bg-green-100 text-green-700': req.status === 'Approved',
                'bg-red-100 text-red-700': req.status === 'Rejected',
              }"
            >
              {{ req.status }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { apiGet, getLoggedUser } from '@/utils/api.js'

const requests = ref([])
const loading = ref(true)

async function fetchRequests() {
  loading.value = true
  try {
    const user = await getLoggedUser()
    const filters = encodeURIComponent(JSON.stringify([['requester', '=', user]]))
    const data = await apiGet(
      `/api/resource/Asset Request?fields=["name","asset","reason","status"]&filters=${filters}&limit=100`
    )
    requests.value = data.data || []
  } catch {
    requests.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRequests)
</script>
