import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { PROJECT_PATH } from "../../../components/layout/navigation";

const EASE = [0.22, 1, 0.36, 1];

function revealMotion(prefersReducedMotion, delay) {
  return {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: prefersReducedMotion ? 0 : delay,
      ease: EASE,
    },
  };
}

/**
 * Services page hero.
 *
 * Unlike the service-detail hero, this one never inverts: it reads the same
 * semantic tokens as the rest of the page (`bg-background`, `text-text-primary`,
 * `border-border`, the theme's ambient glow), so dark mode is dark and light
 * mode is light with no second theme system and nothing to keep in sync.
 *
 * It carries the page `h1`; the search, the categories and the grid below rely
 * on it for the heading level. The two hairline arcs are the same motif the
 * services preview uses on the home page, which is what makes this read as part
 * of the page rather than a detachable banner.
 */
function ServicesHero() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="services-hero-title"
      className="relative isolate overflow-hidden border-b border-border bg-background pt-12 pb-14 transition-colors duration-300 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20"
    >
      {/* Theme-driven ambience: the same token the rest of the site uses, so the
          wash follows the active mode instead of fighting it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundImage: "var(--ambient-brand-glow)" }}
      />

      {/* Hairline arcs, mirrored in RTL. Border colour only: no fill, no glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rtl:-scale-x-100"
      >
        <div className="absolute top-0 left-[-24%] h-[min(30vw,16rem)] w-[112%] -translate-y-[70%] rounded-[50%] border border-border" />
        <div className="absolute right-[-24%] bottom-0 h-[min(34vw,18rem)] w-[112%] translate-y-[70%] rounded-[50%] border border-border" />
      </div>

      <Container>
        <div className="max-w-3xl">
          <motion.div {...revealMotion(prefersReducedMotion, 0)}>
            <Badge variant="neon" className="gap-2">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-neon"
              />
              {t("common.services")}
            </Badge>
          </motion.div>

          <motion.h1
            id="services-hero-title"
            {...revealMotion(prefersReducedMotion, 0.08)}
            className="mt-6 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-bold tracking-tight text-balance text-text-primary rtl:leading-[1.3] rtl:tracking-normal"
          >
            {t("services.pageTitle")}
          </motion.h1>

          <motion.p
            {...revealMotion(prefersReducedMotion, 0.14)}
            className="mt-5 max-w-2xl text-body leading-[1.75] text-text-secondary"
          >
            {t("services.pageDescription")}
          </motion.p>

          <motion.div
            {...revealMotion(prefersReducedMotion, 0.2)}
            className="mt-9"
          >
            <Button as={Link} to={PROJECT_PATH}>
              {t("common.startProject")}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 rtl:-scale-x-100"
              />
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default ServicesHero;
