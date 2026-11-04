import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

const EASE = [0.22, 1, 0.36, 1];

/**
 * "What's included": numbered tiles beside the section label.
 *
 * The tiles come from `service.features`, which only exists once real scope
 * information is available. Items without a title are dropped and the section
 * disappears entirely when nothing is configured, so the page never claims a
 * capability the studio has not actually described.
 */
function ServiceIncluded({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const features = (Array.isArray(service.features) ? service.features : [])
    .map((feature, index) => ({
      id: `${feature?.titleKey ?? "included"}-${index}`,
      title: readTranslation(t, feature?.titleKey),
      description: readTranslation(t, feature?.descriptionKey),
    }))
    .filter((feature) => feature.title.length > 0);

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
              {t("services.included.title")}
            </h2>
            <p className="mt-5 max-w-md text-body leading-[1.75] text-text-secondary">
              {t("services.included.description")}
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {features.map((feature, index) => (
              <motion.li
                key={feature.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: EASE,
                }}
                className="relative isolate overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-brand/40 sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-8 -bottom-8 size-24 rounded-full border border-border/70"
                />

                <span
                  aria-hidden="true"
                  className="block text-small font-semibold tabular-nums text-brand-light"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-4 text-xl leading-snug font-semibold text-text-primary">
                  {feature.title}
                </h3>

                {feature.description ? (
                  <p className="mt-3 text-small leading-[1.7] text-text-secondary">
                    {feature.description}
                  </p>
                ) : null}
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default ServiceIncluded;
