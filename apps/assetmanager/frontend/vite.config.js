import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { loadEnv } from 'vite'

const iconsStubPlugin = {
  name: 'icons-stub',
  enforce: 'pre',
  resolveId(id) {
    if (id.startsWith('~icons/') || id.startsWith('virtual:icons-stub/')) {
      return '\0icons-stub:' + id
    }
  },
  load(id) {
    if (id.startsWith('\0icons-stub:')) {
      return `import { defineComponent, h } from 'vue'
export default defineComponent({ render() { return h('span') } })`
    }
  },
}

export default defineConfig(mode => {

  // Load .env variables — available as env.VITE_BACKEND_URL etc.
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:8000'

  return {
    plugins: [
      vue(),
      iconsStubPlugin,
    ],
    optimizeDeps: {
      include: [
        'frappe-ui > feather-icons',
        'showdown',
        "interactjs",
        'engine.io-client',
        'highlight.js',
        'highlight.js/lib/core',
      ],
      exclude: ['frappe-ui'],
    },
    build: {
      commonjsOptions: {
        include: [/highlight\.js/, /node_modules/],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})