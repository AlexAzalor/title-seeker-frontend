import { defineConfig } from "orval";

module.exports = defineConfig({
  api: {
    output: {
      mode: "tags-split",
      target: "src/orval_api/api.generated.ts",
      schemas: "src/orval_api/model",
      client: "axios",
    },
    input: "./openapi.json",
  },
});
