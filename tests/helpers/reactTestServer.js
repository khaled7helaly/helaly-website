import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

const projectRoot = resolve(
  fileURLToPath(new URL("../..", import.meta.url)),
);

/**
 * Same shape as `createRequestTestServer`, plus the React plugin so `.jsx`
 * modules can be loaded and rendered to static markup in Node.
 */
export function createReactTestServer() {
  return createServer({
    root: projectRoot,
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
  });
}
