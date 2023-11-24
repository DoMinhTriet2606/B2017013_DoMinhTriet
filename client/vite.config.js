import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import VitePluginVue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [VitePluginVue()],
    optimizeDeps: {
        include: ["vue-carousel"],
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 8001,
        proxy: {
            "/api": {
                target: "http://localhost:8000/",
                changeOrigin: true,
            },
        },
    },
});
