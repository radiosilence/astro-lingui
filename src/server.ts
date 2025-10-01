import type { ExtractorType } from "@lingui/conf";
import type { AstroIntegration } from "astro";
import { extractor } from "./extractor";
import { integration } from "./integration";

const astroLingui: {
  extractor: ExtractorType;
  integration: (...args: any[]) => AstroIntegration;
} = {
  extractor,
  integration,
};

export default astroLingui;
