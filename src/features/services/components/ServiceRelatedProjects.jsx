import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import ProjectCard from "../../projects/components/ProjectCard";
import { getRelatedProjects } from "../utils/services";

/**
 * Related work for this service.
 *
 * Projects are matched through `relatedProjectSlugs`, or through the shared
 * `category` slug when no explicit list is configured. While the portfolio is
 * empty the section renders nothing at all rather than an empty placeholder,
 * because a "related work" block with no work in it is worse than no block.
 */
function ServiceRelatedProjects({ service, projects }) {
  const { t } = useTranslation();
  const related = getRelatedProjects(projects, service);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
          {t("services.relatedProjects.title")}
        </h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((project) => (
            <li key={project.slug} className="min-w-0">
              <ProjectCard project={project} showFeatured={false} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ServiceRelatedProjects;
