import { extractor } from "./extractor";
import { integration } from "./integration";

const astroLingui: {
  extractor: typeof extractor;
  integration: typeof integration;
} = {
  extractor,
  integration,
};

export default astroLingui;
