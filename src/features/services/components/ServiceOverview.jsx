import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

const EASE = [0.22, 1, 0.36, 1];

/**
 * What the service is, who it is for, and what problem it solves.
 *
 * A lead paragraph carries the overview, with two supporting columns beneath, so
 * this reads differently from the project case-study layout. Blocks with no
 * translation are dropped and the section disappears when none of them exist.
 */
function ServiceOverview({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const overview = readTranslation(t, service.overviewKey);
  const supporting = [
    { id: "audience", label: t("services.overview.audience"), text: readTranslation(t, service.audienceKey) },
    { id: "challenges", label: t("services.overview.challenges"), text: readTranslation(t, service.challengesKey) },
  ].filter((block) => block.text.length > 0);

  if (overview.length === 0 && supporting.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
            {t("services.overview.title")}
          </h2>

          {overview ? (
            <p className="mt-6 max-w-[62ch] text-heading-md leading-[1.45] font-medium text-balance whitespace-pre-line text-text-primary">
              {overview}
            </p>
          ) : null}
        </motion.div>

        {supporting.length > 0 ? (
          <div className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-2 sm:gap-10">
            {supporting.map((block, index) => (
              <motion.div
                key={block.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : index * 0.06,
                  ease: EASE,
                }}
              >
                <h3 className="text-small font-semibold tracking-[0.18em] text-text-secondary uppercase rtl:normal-case rtl:tracking-normal">
                  {block.label}
                </h3>
                <p className="mt-3 text-body leading-[1.75] whitespace-pre-line text-text-secondary">
                  {block.text}
                </p>
              </motion.div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default ServiceOverview;
