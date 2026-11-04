import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../context/ThemeContext";

/*
  Sun / moon segmented switch. Still one button that calls toggleTheme, so it needs nothing
  new from ThemeContext. Colours come from tokens only (the old hover:text-white disappeared
  on the light theme).
*/
function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDarkMode = theme === "dark";
  const label = isDarkMode
    ? t("common.theme.switchToLightMode")
    : t("common.theme.switchToDarkMode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative inline-flex h-10 w-[4.5rem] shrink-0 items-center justify-between rounded-full border border-border bg-surface p-1 transition-colors duration-200 hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 start-1 w-[1.875rem] rounded-full bg-text-primary transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isDarkMode ? "translate-x-8 rtl:-translate-x-8" : "translate-x-0"
        }`}
      />

      <span
        className={`relative grid size-[1.875rem] place-items-center transition-colors duration-300 motion-reduce:transition-none ${
          isDarkMode ? "text-text-secondary" : "text-background"
        }`}
      >
        <Sun aria-hidden="true" className="size-4" />
      </span>

      <span
        className={`relative grid size-[1.875rem] place-items-center transition-colors duration-300 motion-reduce:transition-none ${
          isDarkMode ? "text-background" : "text-text-secondary"
        }`}
      >
        <Moon aria-hidden="true" className="size-4" />
      </span>

      <span className="sr-only">{label}</span>
    </button>
  );
}

export default ThemeSwitcher;