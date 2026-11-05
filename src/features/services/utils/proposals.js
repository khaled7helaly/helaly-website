import PROPOSALS from "../../../data/proposals.json";

/**
 * Proposal lookup for the service details page.
 *
 * One proposal per service, joined on the service slug. The map is built once
 * at module load because the JSON is static.
 *
 * A proposal holds its own opening headline, short introduction and the ordered
 * sections that make up the document. What's included comes from the service's
 * own `features`, the optional features come from `addons.json`, and the
 * starting price comes from the service record — so none of that is duplicated
 * here.
 *
 * @typedef {"complete" | "outline"} ProposalStatus
 *
 * @typedef {object} ProposalSection
 * @property {string} id       Stable key for React and for the JSON reader.
 * @property {string} titleKey i18n key for the section heading.
 * @property {"prose" | "list" | "pairs"} type
 * @property {string} [bodyKey]  i18n key for a `prose` section.
 * @property {string} [itemsKey] i18n key for a `list` or `pairs` section.
 * @property {"highlight"} [tone]
 *
 * @typedef {object} ServiceProposal
 * @property {string} id
 * @property {string} serviceSlug
 * @property {string} reference
 * @property {ProposalStatus} status  `outline` means the copy is not written yet.
 * @property {string} headlineKey     i18n key for the opening headline.
 * @property {string | null} introKey i18n key for the short introduction.
 * @property {string[]} [actions]     Extra actions the footer may offer.
 * @property {ProposalSection[]} [sections]
 */

const PROPOSALS_BY_SLUG = new Map(
  PROPOSALS.map((proposal) => [proposal.serviceSlug, proposal]),
);

/**
 * @param {string | undefined} slug
 * @returns {ServiceProposal | null}
 */
export function getProposalByServiceSlug(slug) {
  if (typeof slug !== "string" || slug.trim().length === 0) {
    return null;
  }

  return PROPOSALS_BY_SLUG.get(slug.trim()) ?? null;
}

export default getProposalByServiceSlug;
