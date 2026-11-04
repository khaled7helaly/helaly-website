import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDarkMode = theme === "dark";
  const label = isDarkMode
    ? t("common.theme.switchToLightMode")
    : t("common.theme.switchToDarkMode");

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface px-0 text-text-primary transition-colors duration-200 hover:border-brand-bright hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
    >
      {isDarkMode ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
      <span className="sr-only">{label}</span>
    </Button>
  );
}

export default ThemeSwitcher;
