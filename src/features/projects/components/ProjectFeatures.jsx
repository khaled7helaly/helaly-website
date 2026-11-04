import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Numbered feature rows.
 *
 * Only features that carry a resolvable title are rendered, so a project can
 * list as many or as few as it actually implemented. With no valid features the
 * whole section is omitted instead of showing an empty shell.
 */
function ProjectFeatures({ project }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const features = (Array.isArray(project.features) ? project.features : [])
    .map((feature, index) => ({
      id: `${feature?.titleKey ?? "feature"}-${index}`,
      title: readTranslation(t, feature?.titleKey),
      description: readTranslation(t, feature?.descriptionKey),
    }))
    .filter((feature) => feature.title.length > 0);

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <h2 className="text-heading-md font-bold tracking-tight text-text-primary">
          {t("projects.features")}
        </h2>

        <ol className="mt-10">
          {features.map((feature, index) => (
            <motion.li
              key={feature.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: prefersReducedMotion ? 0 : index * 0.05,
                ease: EASE,
              }}
              className="grid gap-3 border-t border-border py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-baseline"
            >
              <span
                aria-hidden="true"
                className="text-small font-semibold tabular-nums text-brand-light"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="text-heading-md leading-tight font-semibold text-text-primary">
                {feature.title}
              </h3>

              {feature.description ? (
                <p className="text-body leading-[1.75] text-text-secondary">
                  {feature.description}
                </p>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export default ProjectFeatures;
