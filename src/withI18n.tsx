import config from "virtual:astro-lingui-config";
import { localeModules } from "virtual:astro-lingui-modules";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { type ComponentType, type ReactElement, use } from "react";

const activationCache = new Map<string, Promise<void>>();

function activateLocale(locale: string): Promise<void> {
  const cached = activationCache.get(locale);
  if (cached) return cached;

  const modulePath = config.path
    .replace("<rootDir>", "")
    .replace("{locale}", locale);
  const loader = localeModules[modulePath];

  if (!loader) {
    throw new Error(`No locale messages found for: ${locale} (${modulePath})`);
  }

  const promise = loader().then(({ messages }) => {
    i18n.loadAndActivate({ locale, messages });
  });

  activationCache.set(locale, promise);
  return promise;
}

export function withI18n<P extends object>(
  C: ComponentType<P>,
): (props: P & { locale: string }) => ReactElement {
  return (props: P & { locale: string }): ReactElement => {
    use(activateLocale(props.locale));

    return (
      <I18nProvider i18n={i18n}>
        <C {...props} />
      </I18nProvider>
    );
  };
}
