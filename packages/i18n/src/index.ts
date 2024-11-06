import i18next, { dir } from "i18next";

import { I18nextProvider } from "./I18nextProvider";
import { detectLanguage, getServerTranslations } from "./server";

export * from "./settings";

export { detectLanguage, I18nextProvider, dir, getServerTranslations, i18next };
