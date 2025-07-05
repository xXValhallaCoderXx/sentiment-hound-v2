import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: true,
  },
  esbuild: {
    target: "node18",
  },
});

export default baseConfig;
