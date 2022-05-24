import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/html-element-sandbox/",
  build: {
    lib: {
      entry: "src/html-element-sandbox.ts",
      formats: ["es"],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
