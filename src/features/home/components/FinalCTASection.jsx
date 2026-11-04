import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { PROJECT_PATH, SERVICES_PATH } from "../../../components/layout/navigation";

const EASE = [0.22, 1, 0.36, 1];

const REVEAL = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.35 },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function FinalCTASection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const reveal = prefersReducedMotion ? undefined : REVEAL;

  return (
    <section className="relative isolate overflow-hidden border-t border-border bg-background py-20 sm:py-24 lg:py-28">
      {/* One faint accent wash behind the message. No blooms, no blur. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_26rem_at_6%_26%,var(--neon-glow),transparent_70%)]"
      />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <motion.div variants={STAGGER} {...reveal}>
            {/* The hero's marker and hairline, reused as the closing note. */}
            <motion.p
              variants={FADE_UP}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-light rtl:tracking-normal"
            >
              <span
                aria-hidden="true"
                className="h-px w-8 shrink-0 bg-linear-to-r from-accent/60 to-transparent rtl:-scale-x-100"
              />
              {t("finalCta.eyebrow")}
            </motion.p>

            <motion.h2
              variants={FADE_UP}
              className="mt-6 text-balance text-[clamp(2.3rem,5.2vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.045em] text-text-primary rtl:leading-tight rtl:tracking-normal"
            >
              {t("finalCta.title")}
            </motion.h2>

            <motion.p
              variants={FADE_UP}
              className="mt-6 max-w-xl text-pretty text-base leading-8 text-text-secondary sm:text-lg"
            >
              {t("finalCta.description")}
            </motion.p>

            <motion.div
              variants={FADE_UP}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                as={Link}
                to={PROJECT_PATH}
                size="lg"
                className="w-full justify-center rounded-xl px-7 sm:w-auto"
              >
                {t("finalCta.primaryCta")}
                <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Button>

              <Button
                as={Link}
                to={SERVICES_PATH}
                variant="secondary"
                size="lg"
                className="w-full justify-center rounded-xl sm:w-auto"
              >
                {t("finalCta.secondaryCta")}
                <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </Button>
            </motion.div>
          </motion.div>

          {/* The composition: hairline geometry and one mint arc, drawn beside
              the message instead of boxed into a card. */}
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="hidden items-center justify-center border-s border-border ps-16 lg:flex"
          >
            <svg
              viewBox="0 0 360 360"
              className="h-auto w-full max-w-[22rem] text-border"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="180" cy="180" r="134" stroke="currentColor" strokeWidth="1" />
              <circle
                cx="180"
                cy="180"
                r="94"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.6"
              />
              <circle
                cx="180"
                cy="180"
                r="50"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
              {/* The single coloured line in the drawing. */}
              <path
                d="M180 46a134 134 0 0 1 116 67"
                stroke="var(--brand)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="296" cy="113" r="3.5" fill="var(--brand)" />
            </svg>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTASection;
