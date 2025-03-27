import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist',
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    bundle:true,
    target: 'node18',
    shims: true,
    noExternal: ['@esm_learning/shared'],
    banner: ({ format }) => {
        if (format === 'cjs') {
            return {
                js: '#!/usr/bin/env node'
            };
        }
    }
});
