/**
 * Project data contract for `src/data/projects.json`.
 *
 * The file is an array; ordering comes from `order`, never from file position.
 * Only `slug`, `order`, `titleKey` and `descriptionKey` are required. Every
 * other field is optional and its section is skipped when the value is missing,
 * so a project can be published with as little as a name and a description.
 *
 * `titleKey`, `descriptionKey`, `thumbnail` and `demoUrl` are the names the
 * existing ProjectCard already reads; the case study page reuses them instead of
 * introducing a second set of fields for the same values.
 *
 * @typedef {object} ProjectImage
 * @property {string} src         Path under `public/`, e.g. "/images/projects/foo/detail.webp".
 * @property {string} [altKey]    i18n key for the alt text. Falls back to the project title.
 * @property {number} [width]     Optional intrinsic width; when present with height it sets the frame ratio.
 * @property {number} [height]    Optional intrinsic height.
 *
 * @typedef {object} ProjectFeature
 * @property {string} titleKey         i18n key for the feature name.
 * @property {string} [descriptionKey] i18n key for the feature explanation.
 *
 * @typedef {object} Project
 * @property {string} slug                URL segment used by /work/:slug.
 * @property {number} order               Ascending display order; drives prev/next navigation.
 * @property {string} titleKey            i18n key for the project name.
 * @property {string} descriptionKey      i18n key for the short description shown on cards and in the hero.
 * @property {string} [category]          Slug from `serviceCategories.json`; unresolved slugs are ignored.
 * @property {string} [overviewKey]       i18n key for the "what/purpose/audience" section.
 * @property {string} [challengeKey]      i18n key for the problem the project addressed.
 * @property {string} [solutionKey]       i18n key for how it was solved.
 * @property {ProjectFeature[]} [features]
 * @property {string[]} [technologies]    Plain names, no i18n keys.
 * @property {string} [thumbnail]         Cover image path. When absent the hero uses its typographic composition.
 * @property {string} [thumbnailAltKey]   i18n key for the cover alt text. Falls back to the project title.
 * @property {ProjectImage[]} [gallery]   When absent the gallery section is not rendered at all.
 * @property {string} [demoUrl]           Live preview. Rendered only when it is a safe http(s) URL.
 * @property {string} [repositoryUrl]     Source code. Rendered only when it is a safe http(s) URL.
 * @property {boolean} [featured]         Used by the homepage selection.
 */

/**
 * @param {Project[]} projects
 * @returns {Project[]} a new, ordered array; the input is never mutated.
 */
export function sortProjectsByOrder(projects) {
  if (!Array.isArray(projects)) {
    return [];
  }

  return [...projects].sort(
    (first, second) => (first?.order ?? 0) - (second?.order ?? 0),
  );
}

/**
 * @param {Project[]} projects
 * @param {string | undefined} slug
 * @returns {Project | null}
 */
export function getProjectBySlug(projects, slug) {
  if (!Array.isArray(projects) || typeof slug !== "string") {
    return null;
  }

  const wantedSlug = slug.trim();
  if (wantedSlug.length === 0) {
    return null;
  }

  return projects.find((project) => project?.slug === wantedSlug) ?? null;
}

/**
 * Neighbours in display order. The ends do not wrap around, so the first
 * project has no previous and the last one has no next.
 *
 * @param {Project[]} projects
 * @param {string | undefined} slug
 * @returns {{ previous: Project | null, next: Project | null }}
 */
export function getAdjacentProjects(projects, slug) {
  const ordered = sortProjectsByOrder(projects);
  const index = ordered.findIndex((project) => project?.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
  };
}
