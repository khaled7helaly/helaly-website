import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

/**
 * Overview / challenge / solution.
 *
 * These are three editorial blocks rather than three components: they share one
 * layout and differ only by label, so keeping them together avoids an
 * abstraction per heading. Each block is skipped when its translation is absent,
 * and the whole section disappears when the project has none of them.
 */
function ProjectOverview({ project }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const blocks = [
    { id: "overview", label: t("projects.overview"), key: project.overviewKey },
    { id: "challenge", label: t("projects.challenge"), key: project.challengeKey },
    { id: "solution", label: t("projects.solution"), key: project.solutionKey },
  ]
    .map((block) => ({ ...block, text: readTranslation(t, block.key) }))
    .filter((block) => block.text.length > 0);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="space-y-10 sm:space-y-12">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: prefersReducedMotion ? 0 : index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid gap-4 border-t border-border pt-8 lg:grid-cols-12 lg:gap-10 lg:pt-10"
            >
              <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase lg:col-span-3">
                {block.label}
              </h2>
              <p className="text-body leading-[1.75] whitespace-pre-line text-text-secondary lg:col-span-8 lg:col-start-5">
                {block.text}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ProjectOverview;
