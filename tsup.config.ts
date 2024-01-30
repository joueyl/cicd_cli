import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: true,
    splitting: true,
    watch: true,
    publicDir: './public',
})