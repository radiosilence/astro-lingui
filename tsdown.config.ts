import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/server.ts", "./src/client.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
