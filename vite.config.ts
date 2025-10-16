import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/vite/client-[hash].js",
      },
    },
  },
});
