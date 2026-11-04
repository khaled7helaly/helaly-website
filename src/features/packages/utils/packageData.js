import packagesData from "../../../data/packages.json";

/**
 * Fixed-package data contract for `src/data/packages.json`.
 *
 * Packages are a separate product line from custom services on purpose: they
 * carry a fixed price, a fixed scope and a short, package-specific inquiry
 * form, so they must never be merged into `services.json` or pushed through the
 * large request wizard.
 *
 * @typedef {"fixed" | "from" | "at-cost"} AddonPricingType
 *
 * @typedef {object} PackageAddon
 * @property {string} id                                  Stable id used by the price calculator.
 * @property {string} titleKey                            i18n key for the add-on name.
 * @property {string} [noteKey]                           i18n key for a caveat (at-cost / starting-from).
 * @property {{ type: AddonPricingType, amount?: number, currency?: string }} pricing
 *
 * @typedef {object} PackageDeliverable
 * @property {string} id
 * @property {string} titleKey
 * @property {string} [detailKey]
 *
 * @typedef {object} PackageField
 * @property {string} id
 * @property {"text" | "url" | "number" | "textarea" | "select"} type
 * @property {string} labelKey
 * @property {boolean} required
 * @property {string[]} [options]  Keys into `packageFieldOptions.json`.
 *
 * @typedef {object} PackageRecord
 * @property {string} id
 * @property {string} slug            URL segment used by /packages/:slug.
 * @property {number} order
 * @property {number} price           Numeric base price — never a formatted string.
 * @property {string} currency
 * @property {number} revisions
 * @property {string} deliveryKey
 * @property {string} nameKey
 * @property {string} audienceLabelKey
 * @property {string} taglineKey
 * @property {string} promiseKey
 * @property {string} introKey
 * @property {{ id: string, labelKey: string }[]} audience
 * @property {PackageDeliverable[]} deliverables
 * @property {string[]} highlightIds
 * @property {{ id: string, labelKey: string }[]} requirements
 * @property {PackageAddon[]} addons
 * @property {PackageField[]} fields
 * @property {{ id: string, labelKey: string }[]} notes
 */

// Static data, so ordering happens once at module load rather than per render.
export const packages = [...packagesData].sort(
  (first, second) => first.order - second.order,
);

/**
 * @param {string | undefined} slug
 * @returns {PackageRecord | null}
 */
export function getPackageBySlug(slug) {
  if (typeof slug !== "string") return null;

  const wanted = slug.trim();
  if (wanted.length === 0) return null;

  return packages.find((record) => record.slug === wanted) ?? null;
}

/**
 * @param {PackageRecord} record
 * @param {string} addonId
 * @returns {PackageAddon | null}
 */
export function getPackageAddon(record, addonId) {
  return record?.addons?.find((addon) => addon.id === addonId) ?? null;
}

/**
 * The 4–6 deliverable highlights a package card shows, resolved from the full
 * deliverable list so the card and the proposal can never disagree.
 *
 * @param {PackageRecord} record
 * @returns {PackageDeliverable[]}
 */
export function getHighlightDeliverables(record) {
  if (!record) return [];

  const byId = new Map(record.deliverables.map((item) => [item.id, item]));
  const ids = Array.isArray(record.highlightIds) ? record.highlightIds : [];

  return ids.map((id) => byId.get(id)).filter(Boolean);
}

/**
 * Resolves a package field's `options` keys into concrete `{ value, labelKey }`
 * rows using the shared option groups.
 *
 * @param {PackageField} field
 * @param {Record<string, { value: string, labelKey: string }[]>} optionGroups
 * @returns {{ value: string, labelKey: string }[]}
 */
export function resolveFieldOptions(field, optionGroups) {
  const groups = Array.isArray(field?.options) ? field.options : [];

  return groups.flatMap((groupKey) =>
    Array.isArray(optionGroups?.[groupKey]) ? optionGroups[groupKey] : [],
  );
}
