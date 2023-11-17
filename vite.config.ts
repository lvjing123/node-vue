import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //这个path用到了上面安装的@types/node
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import viteCompression from 'vite-plugin-compression'
import vueJsx from '@vitejs/plugin-vue-jsx'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default (mode) => defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueI18n({
      include: path.resolve(__dirname, 'src/i18n/*'),
      runtimeOnly: false,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'vue-i18n': ['useI18n'],
        },
      ],
      resolvers: [ElementPlusResolver()],
      dts: false,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      },
    }),
    Components({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
  ],
  //这里进行配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/index.scss";',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    target: 'es2015',
    sourcemap: mode === 'development',
    // sourcemap: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 分块打包，例如 echarts
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
