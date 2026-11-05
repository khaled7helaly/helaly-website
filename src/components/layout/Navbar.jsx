import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import BrandLogo from "../brand/BrandLogo";
import Container from "../ui/Container";
import StartButton from "../ui/Startbutton";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import ThemeSwitcher from "./ThemeSwitcher";
import { NAVIGATION_ITEMS, PROJECT_PATH } from "./navigation";

/*
  Sticky, transparent at the top of the page so the hero glow runs behind it
  (the hero pulls itself up by --navbar-height), solid once the page is scrolled.
*/

function Navbar({ brandWordmarkRef, isBrandWordmarkHidden }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pillTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34 };

  return (
    <header
      className={`sticky top-0 z-50 h-[var(--navbar-height)] border-b transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none ${
        scrolled
          ? "border-border bg-background/90 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.6)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <Container className="grid h-full grid-cols-[1fr_auto] items-center gap-3 xl:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <BrandLogo
            wordmarkRef={brandWordmarkRef}
            isWordmarkHidden={isBrandWordmarkHidden}
            className="transition-transform duration-300 hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>

        <nav
          aria-label={t("common.mainNavigation")}
          className="hidden xl:block"
        >
          <ul className="flex items-center gap-1 rounded-full border border-border bg-surface/90 p-1.5 shadow-sm">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                      isActive
                        ? "text-background"
                        : "text-text-secondary hover:bg-text-primary/[0.06] hover:text-text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-text-primary"
                          transition={pillTransition}
                        />
                      )}

                      <span className="relative">
                        {t(item.labelKey)}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <div className="hidden items-center gap-2 xl:flex">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <StartButton to={PROJECT_PATH} size="sm">
              {t("common.startProject")}
            </StartButton>
          </div>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}

export default Navbar;