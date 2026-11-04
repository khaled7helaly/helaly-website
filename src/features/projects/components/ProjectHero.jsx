import { ArrowLeft, ArrowUpRight, Code } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { WORK_PATH } from "../../../components/layout/navigation";
import SERVICE_CATEGORIES from "../../../data/serviceCategories.json";
import getSafeExternalUrl from "../../../lib/getSafeExternalUrl";
import readTranslation from "../../../lib/readTranslation";
import TechnologyList from "./TechnologyList";

const EASE = [0.22, 1, 0.36, 1];

function revealMotion(prefersReducedMotion, delay) {
  return {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: prefersReducedMotion ? 0 : delay,
      ease: EASE,
    },
  };
}

/**
 * The editorial fallback used when a project has no cover image.
 * It is deliberately typographic: no mock browser chrome, no fake screenshot,
 * nothing that could be mistaken for real product imagery.
 */
function EditorialComposition({ position, categoryLabel, title, summary }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-border bg-surface sm:rounded-[2rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--ambient-brand-glow)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px)",
          backgroundSize: "clamp(4rem, 12vw, 9rem) 100%",
        }}
      />

      <div className="relative flex min-h-[19rem] flex-col justify-between gap-12 p-7 sm:min-h-[23rem] sm:p-10 lg:min-h-[27rem] lg:p-14">
        <div className="flex items-start justify-between gap-6">
          <span className="text-small font-semibold tracking-[0.3em] text-brand-light tabular-nums">
            {String(position).padStart(2, "0")}
          </span>
          {categoryLabel ? (
            <span className="text-small font-medium tracking-[0.18em] text-text-secondary uppercase">
              {categoryLabel}
            </span>
          ) : null}
        </div>

        <div>
          <p className="max-w-[22ch] text-[clamp(1.9rem,5vw,3.6rem)] leading-[1.04] font-bold tracking-tight text-balance text-text-primary">
            {title}
          </p>
          <div aria-hidden="true" className="mt-7 h-px w-full bg-border" />
          {summary ? (
            <p className="mt-6 max-w-[52ch] text-body text-text-secondary">
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CoverVisual({ source, alt }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface sm:rounded-[2rem]">
      {/* Fixed ratio frame: the hero reserves its space before the file loads. */}
      <div className="w-full" style={{ aspectRatio: "16 / 10" }}>
        <img
          src={source}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function ProjectHero({ project, position = 0 }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const title = readTranslation(t, project.titleKey);
  // `descriptionKey`, `thumbnail` and `demoUrl` are the field names the existing
  // ProjectCard already reads; the case study reuses them rather than adding a
  // second vocabulary for the same values.
  const summary = readTranslation(t, project.descriptionKey);

  const category = SERVICE_CATEGORIES.find(
    (entry) => entry.slug === project.category,
  );
  const categoryLabel = category ? readTranslation(t, category.titleKey) : "";

  const liveUrl = getSafeExternalUrl(project.demoUrl);
  const repositoryUrl = getSafeExternalUrl(project.repositoryUrl);
  const coverSource =
    typeof project.thumbnail === "string" ? project.thumbnail.trim() : "";
  const coverAlt = readTranslation(t, project.thumbnailAltKey) || title;

  return (
    <section className="relative isolate overflow-hidden pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <Container>
        <motion.div {...revealMotion(prefersReducedMotion, 0)}>
          <Link
            to={WORK_PATH}
            className="inline-flex items-center gap-2 text-small font-medium text-text-secondary transition-colors duration-300 hover:text-brand-light focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {t("common.backToProjects")}
          </Link>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {categoryLabel ? (
              <motion.p
                {...revealMotion(prefersReducedMotion, 0.05)}
                className="text-small font-semibold tracking-[0.24em] text-brand-light uppercase"
              >
                {categoryLabel}
              </motion.p>
            ) : null}

            <motion.h1
              {...revealMotion(prefersReducedMotion, 0.1)}
              className={`text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] font-bold tracking-tight text-balance text-text-primary ${
                categoryLabel ? "mt-5" : ""
              }`}
            >
              {title}
            </motion.h1>

            {summary ? (
              <motion.p
                {...revealMotion(prefersReducedMotion, 0.16)}
                className="mt-6 max-w-[54ch] text-body leading-[1.75] text-text-secondary"
              >
                {summary}
              </motion.p>
            ) : null}
          </div>

          <motion.div
            {...revealMotion(prefersReducedMotion, 0.22)}
            className="flex flex-col justify-end gap-6 lg:col-span-5"
          >
            <TechnologyList
              technologies={project.technologies}
              label={t("projects.technologiesLabel")}
            />

            {liveUrl || repositoryUrl ? (
              <div className="flex flex-wrap gap-3">
                {liveUrl ? (
                  <Button
                    as="a"
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    aria-label={t("projects.openDemo", { title })}
                  >
                    {t("projects.liveDemo")}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Button>
                ) : null}

                {repositoryUrl ? (
                  <Button
                    as="a"
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    aria-label={t("projects.openRepository", { title })}
                  >
                    {t("projects.repository")}
                    <Code aria-hidden="true" className="size-4" />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          {...revealMotion(prefersReducedMotion, 0.28)}
          className="mt-12 sm:mt-16"
        >
          {coverSource.length > 0 ? (
            <CoverVisual source={coverSource} alt={coverAlt} />
          ) : (
            <EditorialComposition
              position={position}
              categoryLabel={categoryLabel}
              title={title}
              summary={summary}
            />
          )}
        </motion.div>
      </Container>
    </section>
  );
}

export default ProjectHero;
