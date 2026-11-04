import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { PROJECT_PATH, WORK_PATH } from "../../../components/layout/navigation";
import readTranslation from "../../../lib/readTranslation";

const LINK_FOCUS =
  "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

function NeighbourLink({ project, direction, className = "" }) {
  const { t } = useTranslation();

  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ArrowLeft : ArrowRight;
  const title = readTranslation(t, project.titleKey);
  const summary = readTranslation(t, project.descriptionKey);

  return (
    <Link
      to={`${WORK_PATH}/${project.slug}`}
      className={`group flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-brand/40 sm:p-8 ${LINK_FOCUS} ${className}`}
    >
      <span className="inline-flex items-center gap-2 text-small font-semibold tracking-[0.18em] text-text-secondary uppercase transition-colors duration-300 group-hover:text-brand-light">
        <Icon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        {t(isPrevious ? "projects.previousProject" : "projects.nextProject")}
      </span>

      <span className="text-heading-md leading-tight font-semibold text-balance text-text-primary">
        {title}
      </span>

      {summary ? (
        <span className="line-clamp-2 text-small leading-[1.7] text-text-secondary">
          {summary}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Closing navigation: ordered neighbours, the way back to the index, and the
 * existing request flow as the call to action. Neighbours come from the project
 * `order` field, so no route or URL is invented here.
 */
function ProjectNavigation({ previous, next }) {
  const { t } = useTranslation();
  const hasNeighbours = Boolean(previous || next);

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        {hasNeighbours ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {previous ? (
              <NeighbourLink project={previous} direction="previous" />
            ) : null}

            {next ? (
              <NeighbourLink
                project={next}
                direction="next"
                className={previous ? "" : "md:col-start-2"}
              />
            ) : null}
          </div>
        ) : null}

        <div
          className={`flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between ${
            hasNeighbours ? "mt-12 border-t border-border pt-8" : ""
          }`}
        >
          <Link
            to={WORK_PATH}
            className={`inline-flex items-center gap-2 text-small font-semibold text-text-secondary transition-colors duration-300 hover:text-brand-light ${LINK_FOCUS}`}
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {t("common.backToProjects")}
          </Link>

          <Button as={Link} to={PROJECT_PATH}>
            {t("projects.startSimilar")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default ProjectNavigation;
