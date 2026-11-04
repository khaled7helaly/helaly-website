import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { NAVIGATION_ITEMS, PROJECT_PATH } from "./navigation";

function MobileMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    firstLinkRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className="relative xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={t("common.mainNavigation")}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-primary transition-colors duration-200 hover:border-brand-bright hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none"
      >
        {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      <div
        id="mobile-navigation-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute end-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2.5rem))] origin-top overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40 transition-[max-height,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
          isOpen
            ? "max-h-[min(32rem,calc(100dvh-5.5rem))] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label={t("common.mainNavigation")} className="p-3">
          <ul className="grid gap-1">
            {NAVIGATION_ITEMS.map((item, index) => (
              <li key={item.to}>
                <NavLink
                  ref={index === 0 ? firstLinkRef : undefined}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center rounded-xl border-s-2 px-4 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                      isActive
                        ? "border-brand bg-surface-raised text-text-primary"
                        : "border-transparent text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border px-2 pt-4">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <Button
              as={Link}
              to={PROJECT_PATH}
              onClick={closeMenu}
              size="sm"
              className="rounded-lg px-4 motion-reduce:transition-none"
            >
              {t("common.startProject")}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;
