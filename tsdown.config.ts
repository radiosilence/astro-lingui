import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./index.ts", "./client.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
