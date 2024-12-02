import { useLanguageStore } from "../store/languageStore";
import { translations } from "../i18n/translations";
import { Translation } from "../i18n/types";

export const useTranslation = () => {
  const { language } = useLanguageStore();
  return {
    t: translations[language] as Translation,
  };
};
