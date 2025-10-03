import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/server.ts", "./src/client.ts", "./src/middleware.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [/^virtual:.*/, /^astro:.*/],
});
