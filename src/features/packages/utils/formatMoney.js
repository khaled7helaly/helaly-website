/**
 * Formats a numeric amount in the locale that matches the active language.
 *
 * Kept apart from the calculator so pricing logic never depends on formatting,
 * and apart from the components so a fixed total and a "starting from" figure
 * are printed the exact same way.
 *
 * @param {number | undefined | null} amount
 * @param {string | undefined} currency
 * @param {string} [language]
 * @returns {string} an empty string when the inputs cannot be formatted.
 */
export default function formatMoney(amount, currency, language = "en") {
  if (amount == null || !Number.isFinite(amount) || !currency) {
    return "";
  }

  const locale = String(language).startsWith("ar") ? "ar-EG" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
