/**
 * Live price calculation for a fixed package.
 *
 * Everything is computed from the numeric `pricing.amount` values in
 * `packages.json` — never from a formatted currency string, which would make
 * the arithmetic depend on locale and on how the price happened to be typed.
 *
 * Three pricing types behave differently on purpose:
 *
 * - `fixed`   — a known amount; it is added to the subtotal.
 * - `from`    — a "starting from" figure; the real cost is only known after a
 *               payment provider is chosen, so it is reported as a variable
 *               line and never folded into the total.
 * - `at-cost` — a pass-through cost with no published price; reported as a
 *               variable line.
 *
 * @typedef {import("./packageData").PackageRecord} PackageRecord
 * @typedef {import("./packageData").PackageAddon} PackageAddon
 *
 * @typedef {object} SelectedFixedAddon
 * @property {string} id
 * @property {string} titleKey
 * @property {number} amount
 * @property {string} currency
 *
 * @typedef {object} VariableAddon
 * @property {string} id
 * @property {string} titleKey
 * @property {string} [noteKey]
 * @property {"from" | "at-cost"} kind
 * @property {number} [amount]
 * @property {string} [currency]
 *
 * @typedef {object} PackagePriceBreakdown
 * @property {string} currency
 * @property {number} base
 * @property {SelectedFixedAddon[]} fixedAddons
 * @property {number} subtotal
 * @property {VariableAddon[]} variableAddons
 */

/**
 * @param {PackageRecord} record
 * @param {string[]} [selectedAddonIds]
 * @returns {PackagePriceBreakdown | null} `null` when the base price is missing
 *   or malformed, so the caller can hide every price surface instead of
 *   printing an invented number.
 */
export default function calculatePackagePrice(record, selectedAddonIds = []) {
  const base = record?.price;
  const currency = record?.currency;

  if (
    base == null ||
    !Number.isFinite(base) ||
    base < 0 ||
    !currency
  ) {
    return null;
  }

  const selected = new Set(
    Array.isArray(selectedAddonIds) ? selectedAddonIds : [],
  );

  /** @type {SelectedFixedAddon[]} */
  const fixedAddons = [];
  /** @type {VariableAddon[]} */
  const variableAddons = [];

  for (const addon of record.addons ?? []) {
    if (!selected.has(addon.id)) continue;

    const pricing = addon.pricing ?? {};

    if (pricing.type === "fixed") {
      // A fixed add-on in another currency cannot be summed without an FX rate,
      // so it is surfaced as a variable line rather than guessed at.
      if (
        Number.isFinite(pricing.amount) &&
        pricing.amount >= 0 &&
        pricing.currency === currency
      ) {
        fixedAddons.push({
          id: addon.id,
          titleKey: addon.titleKey,
          amount: pricing.amount,
          currency,
        });
      } else {
        variableAddons.push({
          id: addon.id,
          titleKey: addon.titleKey,
          noteKey: addon.noteKey,
          kind: "from",
          amount: Number.isFinite(pricing.amount) ? pricing.amount : undefined,
          currency: pricing.currency,
        });
      }

      continue;
    }

    if (pricing.type === "from") {
      variableAddons.push({
        id: addon.id,
        titleKey: addon.titleKey,
        noteKey: addon.noteKey,
        kind: "from",
        amount: Number.isFinite(pricing.amount) ? pricing.amount : undefined,
        currency: pricing.currency,
      });

      continue;
    }

    variableAddons.push({
      id: addon.id,
      titleKey: addon.titleKey,
      noteKey: addon.noteKey,
      kind: "at-cost",
    });
  }

  const subtotal =
    base + fixedAddons.reduce((total, addon) => total + addon.amount, 0);

  return { currency, base, fixedAddons, subtotal, variableAddons };
}
