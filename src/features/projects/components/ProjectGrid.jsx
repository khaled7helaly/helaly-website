import EmptyState from "../../../components/ui/EmptyState";
import projects from "../../../data/projects.json";
import ProjectCard from "./ProjectCard";

/**
 * layout="grid"      equal cards (default, good for the full /work page)
 * layout="showcase"  bento: the first project is a big hero card, the next two sit beside it.
 *                    Only applies when exactly 3 projects are shown, otherwise it falls back to "grid".
 */
function ProjectGrid({
  limit,
  featuredOnly = false,
  layout = "grid",
  className = "",
}) {
  let visibleProjects = projects
    .filter((project) => !featuredOnly || project.featured)
    .sort((first, second) => first.order - second.order);

  if (Number.isFinite(limit) && limit >= 0) {
    visibleProjects = visibleProjects.slice(0, limit);
  }

  if (visibleProjects.length === 0) {
    return (
      <EmptyState
        titleKey="projects.empty.title"
        descriptionKey="projects.empty.description"
        className={className}
      />
    );
  }

  const isShowcase = layout === "showcase" && visibleProjects.length === 3;

  return (
    // role="list" keeps list semantics for screen readers even though the bullets are reset.
    <ul
      role="list"
      className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 ${className}`}
    >
      {visibleProjects.map((project, index) => {
        const isHero = isShowcase && index === 0;

        return (
          <li
            key={project.id}
            className={`flex ${isHero ? "md:col-span-2 lg:row-span-2" : ""}`}
          >
            {/* When every card is featured (home page), the star adds no information. */}
            <ProjectCard
              project={project}
              variant={isHero ? "hero" : "default"}
              showFeatured={!featuredOnly}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ProjectGrid;