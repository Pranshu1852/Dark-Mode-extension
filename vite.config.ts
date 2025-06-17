import {resolve} from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "./src/content.ts"),
        background: resolve(__dirname, "./src/background.ts")
      },
      output: {
        entryFileNames: "[name].js"
      }
    },
    outDir: "dist",
    emptyOutDir: true
  },
})