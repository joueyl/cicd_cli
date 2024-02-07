import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts','src/init/init.ts'],
    format: 'esm',
    dts: true,
    splitting: true,
    watch: false,
    publicDir: './public',
    clean: true,
})