import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [
      tailwind(),
      autoprefixer(),
      AutoImport({
        dts: true,
        imports: ['vue', 'vue-router', 'pinia']
      }),
      Components({
        dts: true,
        resolvers: [AntDesignVueResolver({ importStyle: false })],
        dirs: ['src/renderer/src/components']
      }),
      vue()
    ]
  }
})
