import config from "virtual:astro-lingui-config";
import { localeModules } from "virtual:astro-lingui-modules";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import type { ReactElement } from "react";
import { type ComponentType, useRef } from "react";

export function withI18n<P extends object>(
  C: ComponentType<P>,
): (props: P & { locale: string }) => ReactElement {
  return (props: P & { locale: string }): ReactElement => {
    const activated = useRef(false);
    if (!activated.current) {
      console.log("[withi18n] config", config);
      const modulePath = config.path
        .replace("<rootDir>", "")
        .replace("{locale}", props.locale);
      console.error("[withi18n]", { modulePath, localeModules });
      const loader = localeModules[modulePath];

      if (!loader) {
        throw new Error(
          `No locale messages found for: ${props.locale} (${modulePath})`,
        );
      }

      loader().then(({ messages }) => {
        activated.current = true;
        i18n.loadAndActivate({
          locale: props.locale,
          messages,
        });
      });
    }
    return (
      <I18nProvider i18n={i18n}>
        <C {...props} />
      </I18nProvider>
    );
  };
}
