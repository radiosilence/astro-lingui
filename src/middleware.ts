import { defineMiddleware } from "astro:middleware";
import config from "virtual:astro-lingui-config";
import { localeModules } from "virtual:astro-lingui-modules";
import { i18n } from "@lingui/core";
import type { MiddlewareHandler } from "astro";
import { RTL_LOCALES } from "./constants";

export const onRequest: MiddlewareHandler = defineMiddleware(
  async (context, next) => {
    const { locale = config.sourceLocale } = context.params;

    const modulePath = config.path
      .replace("<rootDir>", "")
      .replace("{locale}", locale);
    const loader = localeModules[modulePath];

    if (!loader) {
      throw new Error(
        `No locale messages found for: ${locale} (${modulePath})`,
      );
    }

    const { messages } = await loader();

    i18n.loadAndActivate({
      locale,
      messages,
    });

    context.locals.isRtl = !!RTL_LOCALES.find(
      (rtlLocale) => rtlLocale === locale,
    );

    context.locals.locales = config.locales;
    context.locals.sourceLocale = config.sourceLocale;

    return next();
  },
);
