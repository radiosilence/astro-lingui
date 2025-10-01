# @radiosilence/astro-lingui

Astro integration for Lingui i18n with virtual modules, automatic RTL detection, and zero-config locale loading.

## Features

- **Virtual module system** - Dynamic locale loading via Vite globs, works in SSG and client-side
- **RTL support** - Automatic detection for 40+ RTL locales (Arabic, Hebrew, Persian, etc.)
- **Custom extractor** - Extract i18n strings from `.astro` files
- **React integration** - `withI18n` HOC for client-side components
- **Type-safe** - Full TypeScript support with virtual module declarations

## Install

```bash
npm install @radiosilence/astro-lingui @lingui/cli @lingui/core @lingui/react @lingui/vite-plugin
```

## Setup

**astro.config.ts**
```ts
import { defineConfig } from "astro/config";
import astroLingui from "@radiosilence/astro-lingui";

export default defineConfig({
  integrations: [
    astroLingui.integration({
      sourceLocale: "en",
      locales: ["en", "fr", "de", "ar"],
      dir: "./src/locales", // relative to project root
    }),
  ],
});
```

**lingui.config.ts**
```ts
import { defineConfig } from "@lingui/cli";
import linguiApi from "@lingui/cli/api";
import astroLingui from "@radiosilence/astro-lingui";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "fr", "de", "ar"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  extractors: [linguiApi.extractor, astroLingui.extractor],
});
```

## Usage

**Middleware** automatically loads locale messages and sets RTL context:

```ts
// Available in all pages via Astro.locals
const { isRtl, locales, sourceLocale } = Astro.locals;
```

**Client-side React components**:

```tsx
import { withI18n } from "@radiosilence/astro-lingui/client";
import { Trans } from "@lingui/react/macro";

export const MyComponent = withI18n(({ locale }: { locale: string }) => {
  return <Trans>Hello World</Trans>;
});
```

**In Astro pages**:

```astro
---
import { Trans } from "@lingui/react/macro";
---

<Trans>Welcome</Trans>
```

## How it Works

The integration creates two virtual modules:

- `virtual:astro-lingui-config` - Config with absolute/relative paths
- `virtual:astro-lingui-modules` - Vite glob imports for locale message files

This approach allows the same locale files to be loaded both server-side (during SSG) and client-side (lazy-loaded) without hardcoding paths.

## License

MIT
