// Comprehensive list of RTL (Right-to-Left) language codes
// Based on languages using RTL scripts: Arabic, Hebrew, Persian, Urdu, Pashto, Kurdish, Sindhi, etc.
export const RTL_LOCALES = [
  // Arabic (ar) - ~422M speakers
  "ar",
  "ar-AE",
  "ar-BH",
  "ar-DZ",
  "ar-EG",
  "ar-IQ",
  "ar-JO",
  "ar-KW",
  "ar-LB",
  "ar-LY",
  "ar-MA",
  "ar-OM",
  "ar-PS",
  "ar-QA",
  "ar-SA",
  "ar-SD",
  "ar-SY",
  "ar-TN",
  "ar-YE",

  // Hebrew (he) - ~8M speakers
  "he",
  "he-IL",

  // Persian/Farsi (fa) - ~110M speakers
  "fa",
  "fa-IR",
  "fa-AF",

  // Urdu (ur) - ~100M speakers
  "ur",
  "ur-PK",
  "ur-IN",

  // Pashto (ps) - ~60M speakers
  "ps",
  "ps-AF",
  "ps-PK",

  // Kurdish (ku/ckb) - when written in Arabic script
  "ku",
  "ku-IQ",
  "ku-IR",
  "ckb",
  "ckb-IQ",
  "ckb-IR",

  // Sindhi (sd) - ~25M speakers
  "sd",
  "sd-PK",
  "sd-IN",

  // Uyghur (ug) - ~10M speakers
  "ug",
  "ug-CN",

  // Dhivehi/Maldivian (dv) - ~340K speakers
  "dv",
  "dv-MV",

  // Yiddish (yi) - when written in Hebrew script
  "yi",

  // Other RTL languages
  "arc", // Aramaic
  "azb", // South Azeri
  "rhg", // Rohingya
] as const;
