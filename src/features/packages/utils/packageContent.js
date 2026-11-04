/**
 * Item ids for the shared package FAQ and the commercial terms.
 *
 * These blocks are identical for every package, so they are described here as
 * ids that map onto the `packages.faq.items.*` and `packages.terms.*` branches
 * of the locale files instead of being duplicated in `packages.json`.
 *
 * Answers are the supplied catalogue's own wording; no policy is invented here.
 */

export const PACKAGE_FAQ_IDS = [
  "deliveryStart",
  "deposit",
  "paymentMethods",
  "revisions",
  "ownership",
  "thirdParty",
  "guarantees",
  "cancellation",
];

export const PACKAGE_TERMS_IDS = [
  "payment",
  "delivery",
  "revisions",
  "ownership",
  "guarantees",
  "refunds",
];

/**
 * @returns {{ id: string, questionKey: string, answerKey: string }[]}
 */
export function getPackageFaqItems() {
  return PACKAGE_FAQ_IDS.map((id) => ({
    id,
    questionKey: `packages.faq.items.${id}.question`,
    answerKey: `packages.faq.items.${id}.answer`,
  }));
}

/**
 * @returns {{ id: string, titleKey: string, bodyKey: string }[]}
 */
export function getPackageTermsSections() {
  return PACKAGE_TERMS_IDS.map((id) => ({
    id,
    titleKey: `packages.terms.${id}.title`,
    bodyKey: `packages.terms.${id}.body`,
  }));
}
