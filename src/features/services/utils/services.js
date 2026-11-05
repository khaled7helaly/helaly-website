import SERVICE_CATEGORIES from "../../../data/serviceCategories.json";
import { sortProjectsByOrder } from "../../projects/utils/projects";

/**
 * Service data contract for `src/data/services.json`.
 *
 * Required: `id`, `slug`, `category`, `titleKey`, `descriptionKey`, `order`.
 * Everything else is optional, and the section that renders it disappears when
 * the value is absent — a service can ship with just a name and a description.
 *
 * @typedef {object} ServiceItem
 * @property {string} [titleKey]         i18n key for the item's name.
 * @property {string} [descriptionKey]   i18n key for the short explanation.
 *
 * @typedef {object} Service
 * @property {string} id                 Stable identifier used by the request reducer.
 * @property {string} slug               URL segment used by /services/:slug.
 * @property {string} category           Slug from `serviceCategories.json`.
 * @property {number} order              Display order within its category.
 * @property {string} titleKey           i18n key for the service name.
 * @property {string} descriptionKey     i18n key for the short description.
 * @property {string} [overviewKey]      i18n key for "what is this service".
 * @property {string} [audienceKey]      i18n key for "who might need it".
 * @property {string} [challengesKey]    i18n key for "what problem it solves".
 * @property {ServiceItem[]} [features]       What the service can include.
 * @property {ServiceItem[]} [deliverables]   What the client receives.
 * @property {string[]} [processStepIds]  Subset of `processSteps.json` ids; omitted means the full process.
 * @property {string[]} [faqIds]          Ids from `src/data/faqs.js`; omitted means no FAQ section.
 * @property {string[]} [relatedProjectSlugs] Explicit related work; omitted falls back to the shared category.
 * @property {string} [image]            Optional cover image path.
 * @property {boolean} [featured]        General "highlight this service" flag (cards, footer).
 * @property {boolean} [heroFeatured]    Opts the service into the home page hero spotlight.
 * @property {number} [featuredOrder]    Sequence within the hero spotlight; lower comes first.
 * @property {number | null} [startingPrice] Starting price. `null` means "pending configuration".
 * @property {string} [currency]
 * @property {object} [requestConfig]     Which fields the request wizard asks for this service.
 */

const CATEGORY_ORDER = new Map(
  SERVICE_CATEGORIES.map((category, index) => [category.slug, index]),
);

/**
 * Orders services the way the services grid presents them: by category, then by
 * the service's own `order`.
 *
 * @param {Service[]} services
 * @returns {Service[]} a new array; the input is never mutated.
 */
export function sortServicesByOrder(services) {
  if (!Array.isArray(services)) {
    return [];
  }

  return [...services].sort((first, second) => {
    const categoryDifference =
      (CATEGORY_ORDER.get(first?.category) ?? 0) -
      (CATEGORY_ORDER.get(second?.category) ?? 0);

    return categoryDifference || (first?.order ?? 0) - (second?.order ?? 0);
  });
}

/**
 * @param {Service[]} services
 * @param {string | undefined} slug
 * @returns {Service | null}
 */
export function getServiceBySlug(services, slug) {
  if (!Array.isArray(services) || typeof slug !== "string") {
    return null;
  }

  const wantedSlug = slug.trim();
  if (wantedSlug.length === 0) {
    return null;
  }

  return services.find((service) => service?.slug === wantedSlug) ?? null;
}

/**
 * @param {Service[]} services
 * @param {string | undefined} category
 * @returns {Service[]}
 */
export function getServicesByCategory(services, category) {
  return sortServicesByOrder(services).filter(
    (service) => service?.category === category,
  );
}

/**
 * 1-based position of a service inside its own category. Used for the hero's
 * editorial numbering, which is why it is scoped to the category rather than to
 * the whole catalogue.
 *
 * @param {Service[]} services
 * @param {Service} service
 * @returns {number}
 */
export function getServiceOrdinal(services, service) {
  const siblings = getServicesByCategory(services, service?.category);
  const index = siblings.findIndex((item) => item?.slug === service?.slug);

  return index === -1 ? 0 : index + 1;
}

/**
 * Related work for a service.
 *
 * An explicit `relatedProjectSlugs` list wins; otherwise projects are matched on
 * the shared `category` slug, which is the only relationship the two data
 * sources actually have in common.
 *
 * @param {import("../../projects/utils/projects").Project[]} projects
 * @param {Service} service
 * @param {number} [limit]
 * @returns {import("../../projects/utils/projects").Project[]}
 */
export function getRelatedProjects(projects, service, limit = 3) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return [];
  }

  const explicitSlugs = Array.isArray(service?.relatedProjectSlugs)
    ? service.relatedProjectSlugs
    : [];

  if (explicitSlugs.length > 0) {
    const bySlug = new Map(projects.map((project) => [project?.slug, project]));

    return explicitSlugs
      .map((slug) => bySlug.get(slug))
      .filter((project) => project !== undefined)
      .slice(0, limit);
  }

  if (!service?.category) {
    return [];
  }

  return sortProjectsByOrder(
    projects.filter((project) => project?.category === service.category),
  ).slice(0, limit);
}
