# astro-lingui

Astro integration for Lingui i18n with virtual modules, automatic RTL detection, and zero-config locale loading.

Supports Astro 5 and 6, Lingui 5.5+, React 19. Requires Node 22+.

## Features

- **Virtual module system** - Dynamic locale loading via Vite globs, works in SSG and client-side
- **RTL support** - Automatic detection for 40+ RTL locales (Arabic, Hebrew, Persian, etc.)
- **Custom extractor** - Extract i18n strings from `.astro` files
- **React integration** - `withI18n` HOC for client-side components with Suspense support
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
      path: "<rootDir>/src/locales/{locale}/messages",
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

const { locale, isRtl, locales, sourceLocale } = Astro.locals;
---

<h1 dir={isRtl ? "rtl" : "ltr"}>
  {i18n._("Welcome")}
</h1>
```

**Client-side React components**:

`withI18n` uses React 19's `use()` hook, so components must be wrapped in a `<Suspense>` boundary:

```astro
---
import { MyComponent } from "../components/MyComponent";
---

<Suspense fallback={<p>Loading...</p>}>
  <MyComponent locale={Astro.locals.locale} client:load />
</Suspense>
```

```tsx
import { withI18n } from "astro-lingui/client";
import { i18n } from "@lingui/core";

export const MyComponent = withI18n(({ locale }: { locale: string }) => {
  return <h1>{i18n._("Hello World")}</h1>;
});
```

**Note**: Macro support (`Trans`, `t`, `msg`) is not available for `.astro` files. Use `i18n._()` directly instead. Macros work normally in `.tsx` files.

### Using i18n.\_() in .astro Files

The custom extractor picks up `i18n._()` calls from `.astro` files. After extraction and compilation, ICU MessageFormat features are available:

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

**Workflow**:

1. Write `i18n._("message.id", { variables })` in `.astro` files
2. Run `lingui extract` to pull message IDs into catalogs
3. Edit catalogs (`.po` files) to add ICU MessageFormat patterns
4. Run `lingui compile` to generate optimized message files

**Injecting React components**: `i18n._()` only returns strings. For translations with embedded components, use the runtime `Trans` component from `@lingui/react` in your React components:

```tsx
import { Trans } from "@lingui/react";

<Trans
  id="Read <link>the docs</link> for more"
  components={{ link: <a href="/docs" /> }}
/>;
```

## How it Works

The integration creates two virtual modules:

- `virtual:astro-lingui-config` - Config with resolved paths
- `virtual:astro-lingui-modules` - Vite glob imports for locale message files

Locale files load server-side during SSG and client-side via lazy loading, without hardcoding paths.

## License

MIT
