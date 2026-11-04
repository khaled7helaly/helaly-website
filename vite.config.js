import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Absolute base path the site is served from.
 * GitHub Pages project sites live under `/<repository>/`, so the built asset
 * URLs must be prefixed accordingly. Vite exposes this value to the app as
 * `import.meta.env.BASE_URL`, which is also used as the router basename.
 */
const BASE_PATH = "/helaly-website/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    tailwindcss(),
  ],
});
