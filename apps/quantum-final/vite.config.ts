import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    allowedHosts: [
      "01015b1d-465d-42e2-a6be-fa2a26cbd300-00-24lfax4g48h1.worf.replit.dev"
    ]
  },
})

