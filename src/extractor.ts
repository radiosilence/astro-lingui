/**
 * Custom Lingui extractor for Astro files
 * This allows i18n strings in .astro files to be extracted
 */

import { convertToTSX } from "@astrojs/compiler";
import linguiApi from "@lingui/cli/api";
import type { ExtractorType } from "@lingui/conf";

/**
 * Lingui custom extractor for .astro files
 * Follows the Lingui v4+ extractor API
 */
export const extractor: ExtractorType = {
  match(filename: string): boolean {
    return filename.endsWith(".astro");
  },

  async extract(filename, code, onMessageExtracted, ctx) {
    const { code: tsxCode, map } = await convertToTSX(code);
    if (!ctx?.linguiConfig) {
      throw new Error("Lingui config not found");
    }
    return linguiApi.extractor.extract(
      `${filename}.tsx`,
      tsxCode,
      onMessageExtracted,
      { linguiConfig: ctx?.linguiConfig, sourceMaps: map },
    );
  },
};
