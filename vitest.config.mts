import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    server: {
      deps: {
        inline: ["next"],
      },
    },
    setupFiles: [resolve(__dirname, "__tests__/setup/setup.ts")],
    exclude: ["./tests", "./node_modules", "./dist"],
  },
});
