import { useParams } from "react-router";

import PROJECTS from "../data/projects.json";
import ProjectFeatures from "../features/projects/components/ProjectFeatures";
import ProjectGallery from "../features/projects/components/ProjectGallery";
import ProjectHero from "../features/projects/components/ProjectHero";
import ProjectNavigation from "../features/projects/components/ProjectNavigation";
import ProjectOverview from "../features/projects/components/ProjectOverview";
import {
  getAdjacentProjects,
  getProjectBySlug,
  sortProjectsByOrder,
} from "../features/projects/utils/projects";
import NotFoundPage from "./NotFoundPage";

/**
 * Project case study page for /work/:slug.
 *
 * @param {{ projects?: import("../features/projects/utils/projects").Project[] }} props
 *   `projects` defaults to the JSON source; tests inject fixtures through it so
 *   no sample project ever has to live in production data.
 */
function ProjectDetailsPage({ projects = PROJECTS }) {
  const { slug } = useParams();
  const project = getProjectBySlug(projects, slug);

  if (!project) {
    return <NotFoundPage />;
  }

  const { previous, next } = getAdjacentProjects(projects, project.slug);
  const position =
    sortProjectsByOrder(projects).findIndex((item) => item.slug === project.slug) + 1;

  return (
    <>
      <ProjectHero project={project} position={position} />
      <ProjectOverview project={project} />
      <ProjectFeatures project={project} />
      <ProjectGallery project={project} />
      <ProjectNavigation previous={previous} next={next} />
    </>
  );
}

export default ProjectDetailsPage;
