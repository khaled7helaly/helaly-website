import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { getProcessSteps } from "../../../lib/processSteps";

const EASE = [0.22, 1, 0.36, 1];

function ProcessStep({ step, index, prefersReducedMotion }) {
  const { t } = useTranslation();
  const Icon = step.Icon;

  return (
    <motion.li
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.45,
        delay: prefersReducedMotion ? 0 : index * 0.05,
        ease: EASE,
      }}
      className="relative border-t border-border pt-6"
    >
      <span
        aria-hidden="true"
        className="absolute start-0 top-0 size-[5px] -translate-y-1/2 rounded-full bg-brand/70"
      />

      <div className="flex items-center justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-brand-light"
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>

        <span
          aria-hidden="true"
          className="text-small font-semibold tabular-nums text-brand-light"
        >
          {String(step.order).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 text-heading-md leading-tight font-semibold text-text-primary">
        {t(step.titleKey)}
      </h3>
      <p className="mt-2 text-small leading-[1.7] text-text-secondary">
        {t(step.descriptionKey)}
      </p>
    </motion.li>
  );
}

/**
 * The stages of the work, shown as a horizontal rail.
 *
 * The steps and their icons come from the shared process module, so a service
 * that narrows its stages through `processStepIds` reuses the same definitions
 * as the homepage instead of maintaining its own copy.
 */
function ServiceProcess({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const steps = getProcessSteps(service.processStepIds);

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-surface/40 py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={t("services.process.eyebrow")}
          title={t("services.process.title")}
          description={t("services.process.description")}
        />

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-6">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}

export default ServiceProcess;
