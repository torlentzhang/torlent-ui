import { defineConfig } from 'tsup'
import vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['vue', 'element-plus'],
  esbuildPlugins: [vue()],
  outDir: 'dist',
})
