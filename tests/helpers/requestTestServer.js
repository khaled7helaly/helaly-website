import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = resolve(
  fileURLToPath(new URL("../..", import.meta.url)),
);

export function createRequestTestServer() {
  return createServer({
    root: projectRoot,
    configFile: false,
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
  });
}
