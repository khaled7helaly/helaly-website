import formatMoney from "./formatMoney";

/**
 * Short, honest price label for a single add-on.
 *
 * `fixed` shows the amount, `from` keeps its "starting from" wording so it is
 * never read as a firm figure, and `at-cost` says so rather than inventing a
 * number. Returns an empty string when there is nothing truthful to print.
 *
 * @typedef {import("./packageData").PackageAddon} PackageAddon
 *
 * @param {PackageAddon} addon
 * @param {(key: string) => string} t
 * @param {string} [language]
 * @returns {string}
 */
export default function describeAddonPrice(addon, t, language = "en") {
  const pricing = addon?.pricing ?? {};
  const money = formatMoney(pricing.amount, pricing.currency, language);

  if (pricing.type === "fixed") {
    return money;
  }

  if (pricing.type === "from") {
    return money
      ? `${t("packages.addonPanel.from")} ${money}`
      : t("packages.addonPanel.from");
  }

  return t("packages.addonPanel.atCost");
}
