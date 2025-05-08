import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [vue(), dts()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'VueComposableLightbox',
            fileName: (format) => `vue-composable-lightbox.${format}.js`,
        },
        rollupOptions: {
            external: ['vue', 'photoswipe'],
            output: {
                globals: {
                    vue: 'Vue',
                    photoswipe: 'PhotoSwipe'
                },
            },
        },
    },
});