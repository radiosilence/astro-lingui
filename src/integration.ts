import path from "node:path";
import { type LinguiPluginOpts, lingui } from "@lingui/vite-plugin";
import type { AstroIntegration } from "astro";

export const integration = ({
  lingui: linguiOpts,
  ...config
}: {
  lingui?: LinguiPluginOpts;
  locales: string[];
  sourceLocale: string;
  dir: string;
}): AstroIntegration => ({
  name: "astro-lingui",
  hooks: {
    "astro:config:setup": ({
      addMiddleware,
      updateConfig,
      config: astroConfig,
    }) => {
      addMiddleware({
        entrypoint: "astro-lingui/middleware",
        order: "pre",
      });

      // Resolve to absolute path for Node imports (middleware)
      const localesDirAbsolute = path.resolve(
        astroConfig.root.pathname,
        config.dir,
      );

      updateConfig({
        vite: {
          plugins: [
            {
              ...lingui(linguiOpts),
              enforce: "pre",
            },
            {
              name: "vite-plugin-astro-lingui-config",
              resolveId(id: string) {
                if (id === "virtual:astro-lingui-config") {
                  return "\0virtual:astro-lingui-config";
                }
                if (id === "virtual:astro-lingui-modules") {
                  return "\0virtual:astro-lingui-modules";
                }
              },
              load(id: string) {
                if (id === "\0virtual:astro-lingui-config") {
                  const exportedConfig = {
                    ...config,
                    localesDir: localesDirAbsolute,
                  };
                  return `export default ${JSON.stringify(exportedConfig, null, 2)};`;
                }
                if (id === "\0virtual:astro-lingui-modules") {
                  // Normalize path for Vite glob: /src/locales/*/messages.ts
                  const normalized = config.dir.replace(/^\.\//, "/");
                  const globPattern = `${normalized}/*/messages.ts`;
                  return `export const localeModules = import.meta.glob(${JSON.stringify(globPattern)});`;
                }
              },
            },
          ],
        },
      });
    },
  },
});
