# astro-lingui

Astro integration for Lingui i18n with virtual modules, automatic RTL detection, and zero-config locale loading.

## Features

- **Virtual module system** - Dynamic locale loading via Vite globs, works in SSG and client-side
- **RTL support** - Automatic detection for 40+ RTL locales (Arabic, Hebrew, Persian, etc.)
- **Custom extractor** - Extract i18n strings from `.astro` files
- **React integration** - `withI18n` HOC for client-side components
- **Type-safe** - Full TypeScript support with virtual module declarations

## Install

```bash
npm install astro-lingui @lingui/cli @lingui/core @lingui/react @lingui/vite-plugin
```

## Setup

**lingui.config.ts**

```ts
import { defineConfig } from "@lingui/cli";
import linguiApi from "@lingui/cli/api";
import astroLingui from "astro-lingui/server";

export const locales = ["en-GB", "fr-FR", "ar-PS"];
export const sourceLocale = "en-GB";

export default defineConfig({
  sourceLocale,
  locales,
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

**astro.config.ts**

```ts
import { defineConfig } from "astro/config";
import astroLingui from "astro-lingui/server";
import { locales, sourceLocale } from "./lingui.config";

export default defineConfig({
  integrations: [
    astroLingui.integration({
      sourceLocale,
      locales,
      dir: "./src/locales", // relative to project root
    }),
  ],
});
```

**env.d.ts** - Add this reference for TypeScript support:

```ts
/// <reference types="astro/client" />
/// <reference types="astro-lingui/locals" />
```

## Usage

**In Astro pages/components**:

```astro
---
import { i18n } from "@lingui/core";

// Access locale info via Astro.locals
const { isRtl, locales, sourceLocale } = Astro.locals;
---

<h1 dir={isRtl ? "rtl" : "ltr"}>
  {i18n._("Welcome")}
</h1>
```

**Client-side React components**:

```tsx
import { withI18n } from "astro-lingui/client";
import { i18n } from "@lingui/core";

export const MyComponent = withI18n(({ locale }: { locale: string }) => {
  return <h1>{i18n._("Hello World")}</h1>;
});
```

**Note**: Macro support (`Trans`, `t`, `msg`) is not available for `.astro` files. Use `i18n._()` directly instead.

### Using i18n.\_() in .astro Files

The custom extractor will pick up `i18n._()` calls from your `.astro` files. After extraction and compilation, you can use ICU MessageFormat features:

**Simple translation**:

```astro
{i18n._("Welcome to our site")}
```

**String interpolation**:

```astro
{i18n._("Hello {name}", { name: userName })}
```

**Plurals** (after extraction, edit your .po file to add the ICU format):

```astro
{i18n._("item_count", { count: items.length })}
```

In your compiled message catalog, this becomes:

```
{count, plural, one {# item} other {# items}}
```

**Select and SelectOrdinal**: Similar workflow - use a simple ID in code, add ICU format in your message catalogs.

**Important**: ICU MessageFormat features (plural, select, etc.) must be added to your compiled message catalogs - they're not written directly in code. The workflow is:

1. Write `i18n._("message.id", { variables })` in your `.astro` files
2. Run `lingui extract` to pull message IDs into catalogs
3. Edit catalogs (`.po` files) to add ICU MessageFormat patterns
4. Run `lingui compile` to generate optimized message files
5. Messages with ICU patterns will work at runtime

**Injecting React components**: `i18n._()` only returns strings - you can't pass React components as values. For translations with embedded components (like `<a>` tags), use the runtime `Trans` component from `@lingui/react` (NOT the macro version) in your React components:

```tsx
import { Trans } from "@lingui/react"; // runtime component, not macro

<Trans
  id="link.message"
  message="Read <link>the docs</link> for more"
  components={{ link: <a href="/docs" /> }}
/>;
```

This is the runtime version that doesn't require macro transformation. You must provide `id` and `message` props explicitly.

## How it Works

The integration creates two virtual modules:

- `virtual:astro-lingui-config` - Config with absolute/relative paths
- `virtual:astro-lingui-modules` - Vite glob imports for locale message files

This approach allows the same locale files to be loaded both server-side (during SSG) and client-side (lazy-loaded) without hardcoding paths.

## License

MIT
