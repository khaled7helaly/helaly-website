import { useParams } from "react-router";

import PROJECTS from "../data/projects.json";
import SERVICES from "../data/services.json";
import ServiceCta from "../features/services/components/ServiceCta";
import ServiceDeliverables from "../features/services/components/ServiceDeliverables";
import ServiceFaq from "../features/services/components/ServiceFaq";
import ServiceHero from "../features/services/components/ServiceHero";
import ServiceIncluded from "../features/services/components/ServiceIncluded";
import ServiceOverview from "../features/services/components/ServiceOverview";
import ServiceProcess from "../features/services/components/ServiceProcess";
import ServiceProposal from "../features/services/components/ServiceProposal";
import ServiceRelatedProjects from "../features/services/components/ServiceRelatedProjects";
import {
  getServiceBySlug,
  getServiceOrdinal,
} from "../features/services/utils/services";
import NotFoundPage from "./NotFoundPage";

/**
 * Service detail page for /services/:slug.
 *
 * The page is a composition root: every section reads the same service record
 * and renders nothing when the field it depends on is absent, so a service can
 * ship with a name and a description and grow into the fuller layout as data is
 * added. The hero, process and closing CTA are always present because they are
 * backed by data that always exists.
 *
 * @param {{
 *   services?: import("../features/services/utils/services").Service[],
 *   projects?: import("../features/projects/utils/projects").Project[],
 * }} props
 *   Both default to the JSON sources. Tests inject fixtures through them so no
 *   sample service or project ever has to live in production data.
 */
function ServiceDetailsPage({ services = SERVICES, projects = PROJECTS }) {
  const { slug } = useParams();
  const service = getServiceBySlug(services, slug);

  if (!service) {
    return <NotFoundPage />;
  }

  const ordinal = getServiceOrdinal(services, service);

  return (
    <>
      <ServiceHero service={service} ordinal={ordinal} />
      <ServiceOverview service={service} />
      <ServiceProposal key={service.slug} service={service} />
      <ServiceIncluded service={service} />
      <ServiceProcess service={service} />
      <ServiceDeliverables service={service} />
      <ServiceRelatedProjects service={service} projects={projects} />
      <ServiceFaq service={service} />
      <ServiceCta service={service} />
    </>
  );
}

export default ServiceDetailsPage;
