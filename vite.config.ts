// vite.config.ts  (replace)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Custom domain serves from the root. No repo subfolder.
  base: "/",
  build: { outDir: "dist" },
});
