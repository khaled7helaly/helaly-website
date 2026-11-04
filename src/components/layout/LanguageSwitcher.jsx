import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === "ar" ? "en" : "ar";

    i18n.changeLanguage(nextLanguage);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("common.changeLanguage")}
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-border px-3 text-xs font-bold tracking-wide text-text-secondary transition-colors duration-200 hover:border-brand-bright hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
    >
      {currentLanguage === "ar" ? "EN" : "AR"}
    </button>
  );
}

export default LanguageSwitcher;
