import { defineConfig } from "vite";

export default defineConfig({
  base: "/Interactive-Bar-Chart-Viewer/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/vite/client-[hash].js",
      },
    },
  },
});
