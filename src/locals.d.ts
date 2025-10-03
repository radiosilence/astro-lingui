/// <reference types="astro/client" />

declare module "virtual:astro-lingui-config" {
  interface AstroLinguiConfig {
    path: string;
    rootDir: string;
    sourceLocale: string;
    locales: string[];
  }

  const config: AstroLinguiConfig;
  export default config;
}

declare module "virtual:astro-lingui-modules" {
  import type { Messages } from "@lingui/core";
  export const localeModules: Record<
    string,
    () => Promise<{ messages: Messages }>
  >;
}

declare namespace App {
  export interface Locals {
    isRtl: boolean;
    locales: string[];
    sourceLocale: string;
  }
}
