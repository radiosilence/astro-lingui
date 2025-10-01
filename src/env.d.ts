declare module "virtual:astro-lingui-config" {
  interface LinguiConfig {
    dir: string;
    localesDir: string;
    sourceLocale: string;
    locales: string[];
  }

  const config: LinguiConfig;
  export default config;
}

declare module "virtual:astro-lingui-modules" {
  import type { Messages } from "@lingui/core";
  export const localeModules: Record<
    string,
    () => Promise<{ messages: Messages }>
  >;
}

namespace App {
  /**
   * Used by middlewares to store information, that can be read by the user via the global `Astro.locals`
   */
  export interface Locals {
    isRtl: boolean;
    locales: string[];
    sourceLocale: string;
  }
}
