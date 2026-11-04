import { useId } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Accordion from "../../../components/ui/Accordion";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { PROJECT_PATH } from "../../../components/layout/navigation";
import FAQ_ITEMS from "../../../data/faqs";

const EASE = [0.22, 1, 0.36, 1];

// Reveal once, slightly before the block is fully on screen.
const REVEAL = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "0px 0px -12% 0px" },
};

const stagger = (gap) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Static values live outside the component so they keep a stable identity between renders.
const DEFAULT_OPEN_IDS = [FAQ_ITEMS[0]?.id].filter(Boolean);
const HEADER = stagger(0.1);
const BODY = stagger(0.14);

function FAQSection() {
  const { t } = useTranslation();
  const reveal = useReducedMotion() ? undefined : REVEAL;
  const headingId = useId();

  return (
    // No overflow-hidden here: it would break the sticky CTA card on desktop.
    <section
      aria-labelledby={headingId}
      className="relative border-t border-border py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--blue-glow),transparent_38%),radial-gradient(circle_at_bottom_right,var(--neon-glow),transparent_32%)]"
      />

      <Container className="relative">
        <motion.div
          variants={HEADER}
          {...reveal}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-light rtl:normal-case rtl:tracking-normal"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-neon shadow-sm shadow-neon/50" />
            {t("faq.eyebrow")}
          </motion.p>
          <motion.h2
            id={headingId}
            variants={fadeUp}
            className="text-balance text-heading-lg font-bold leading-tight text-text-primary"
          >
            {t("faq.title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-pretty text-base leading-7 text-text-secondary sm:text-lg"
          >
            {t("faq.description")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={BODY}
          {...reveal}
          className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)] lg:items-start"
        >
          <motion.div
            variants={fadeUp}
            className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_28px_60px_-40px_rgba(0,0,0,0.45)]"
          >
            <Accordion
              items={FAQ_ITEMS}
              defaultOpenIds={DEFAULT_OPEN_IDS}
              className="divide-y divide-border"
              itemClassName="px-5 py-1 sm:px-6"
            />
          </motion.div>

          <motion.aside
            variants={fadeUp}
            className="rounded-3xl border border-border bg-surface-raised p-6 sm:p-7 lg:sticky lg:top-28"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand-light">
              <MessageCircleQuestion aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-text-primary">
              {t("faq.ctaTitle")}
            </h3>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              {t("faq.ctaDescription")}
            </p>
            <Button
              as={Link}
              to={PROJECT_PATH}
              size="md"
              className="mt-6 w-full justify-center rounded-xl sm:w-auto"
            >
              {t("faq.ctaButton")}
            </Button>
          </motion.aside>
        </motion.div>
      </Container>
    </section>
  );
}

export default FAQSection;