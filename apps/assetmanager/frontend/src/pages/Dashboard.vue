<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <main class="max-w-5xl mx-auto px-6 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Office Assets</h1>
        <p class="text-sm text-gray-500 mt-1">Browse available assets and submit a request</p>
      </div>

      <div v-if="loadingAssets" class="text-center py-20 text-gray-400">
        Loading assets...
      </div>
      <div v-else-if="assets.length === 0" class="text-center py-20 text-gray-400">
        No assets found.
      </div>
      <div v-else class="grid gap-4">
        <div
          v-for="asset in assets"
          :key="asset.name"
          class="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
        >
          <div>
            <p class="font-semibold text-gray-800 text-base">{{ asset.asset_name }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {{ asset.asset_type }}
              </span>
              <span
                class="text-xs font-medium"
                :class="asset.available_quantity > 0 ? 'text-green-600' : 'text-red-500'"
              >
                {{ asset.available_quantity }} of {{ asset.total_quantity }} available
              </span>
            </div>
          </div>
          <button
            @click="openRequestModal(asset)"
            :disabled="asset.available_quantity === 0"
            class="px-4 py-2 rounded-lg text-sm font-medium transition"
            :class="asset.available_quantity > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            {{ asset.available_quantity > 0 ? 'Request' : 'Out of Stock' }}
          </button>
        </div>
      </div>
    </main>

    <!-- Request Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-1">Request Asset</h2>
        <p class="text-sm text-gray-500 mb-4">{{ selectedAsset?.asset_name }}</p>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Reason <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="reason"
          placeholder="Why do you need this asset?"
          rows="4"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
        <p v-if="modalError" class="text-red-500 text-sm mt-2">{{ modalError }}</p>
        <div class="flex justify-end gap-3 mt-5">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="submitRequest"
            :disabled="submitting"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            {{ submitting ? 'Submitting...' : 'Submit Request' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { apiGet, apiPost, getLoggedUser } from '@/utils/api.js'

const assets = ref([])
const loadingAssets = ref(true)
const showModal = ref(false)
const selectedAsset = ref(null)
const reason = ref('')
const submitting = ref(false)
const modalError = ref('')
const currentUser = ref('')
const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

async function fetchAssets() {
  loadingAssets.value = true
  try {
    const data = await apiGet(
      '/api/resource/Office Asset?fields=["name","asset_name","asset_type","total_quantity","available_quantity"]&limit=100'
    )
    assets.value = data.data || []
  } catch {
    showToast('Failed to load assets.', 'error')
  } finally {
    loadingAssets.value = false
  }
}

function openRequestModal(asset) {
  selectedAsset.value = asset
  reason.value = ''
  modalError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedAsset.value = null
}

async function submitRequest() {
  if (!reason.value.trim()) {
    modalError.value = 'Please provide a reason.'
    return
  }
  submitting.value = true
  modalError.value = ''
  try {
    const { ok, data } = await apiPost('/api/resource/Asset Request', {
      asset: selectedAsset.value.name,
      requester: currentUser.value,
      reason: reason.value,
      status: 'Pending',
    })
    if (ok && data.data) {
      showToast('Request submitted successfully!')
      closeModal()
      fetchAssets()
    } else {
      const errMsg = data.exception || data.message || 'Failed to submit request.'
      modalError.value = errMsg.includes('out of stock') ? 'This asset is out of stock.' : errMsg
    }
  } catch {
    modalError.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  currentUser.value = await getLoggedUser()
  fetchAssets()
})
</script>
