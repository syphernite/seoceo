// vite.config.ts  (replace)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",                 // site at domain root
  build: { outDir: "docs", emptyOutDir: true },
});
