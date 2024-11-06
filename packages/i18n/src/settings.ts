import { fallbackLanguage, languages } from "./constants";

export const defaultNamespace = "common";

export type Languages = ["en", "ru"];

export const getOptions = (
  language: Languages[number] = fallbackLanguage,
  namespace = defaultNamespace,
) => ({
  supportedLngs: languages,
  fallbackLng: fallbackLanguage,
  lng: language,
  fallbackNS: defaultNamespace,
  defaultNS: defaultNamespace,
  ns: namespace,
});
