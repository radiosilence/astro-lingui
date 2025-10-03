import { resolve } from "node:path";
import { type LinguiPluginOpts, lingui } from "@lingui/vite-plugin";
import type { AstroIntegration } from "astro";

export const integration = ({
  lingui: linguiOpts,
  ...config
}: {
  lingui?: LinguiPluginOpts;
  locales: string[];
  sourceLocale: string;
  path: string;
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
      const rootDir = resolve(astroConfig.root.pathname);

      updateConfig({
        vite: {
          optimizeDeps: {
            exclude: [
              "virtual:astro-lingui-config",
              "virtual:astro-lingui-modules",
            ],
          },
          build: {
            rollupOptions: {
              external: [
                "virtual:astro-lingui-config",
                "virtual:astro-lingui-modules",
              ],
            },
          },
          plugins: [
            {
              ...lingui(linguiOpts),
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
                    rootDir,
                  };
                  console.error("exportedConfig", exportedConfig);
                  return `export default ${JSON.stringify(exportedConfig, null, 2)};`;
                }
                if (id === "\0virtual:astro-lingui-modules") {
                  // Normalize path for Vite glob: /src/locales/*/messages.ts
                  const globPattern = config.path
                    .replace("<rootDir>/", "/")
                    .replace("{locale}", "*");
                  console.error("globPattern", globPattern);
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
