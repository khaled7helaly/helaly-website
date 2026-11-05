/**
 * Formats a "starting from" amount as one money unit for the active language.
 *
 * The amount and its currency are printed together because the two languages
 * order them differently — "EGP 3,900" in English, "3,900 جنيه" in Arabic — so
 * the caller can treat the result as a single, untranslatable token.
 *
 * Digits stay Latin in both languages, matching the Arabic example the brand
 * uses ("تبدأ الخدمة من 3,900 جنيه") and keeping the figure unambiguous for the
 * customer and for the business reading it in WhatsApp.
 *
 * The currency word comes from `pricing.currency.*` so nothing is hardcoded; an
 * unknown currency falls back to its ISO code so the number is never lost.
 *
 * @param {number | null | undefined} amount
 * @param {string | undefined} currency
 * @param {string} [language]
 * @param {(key: string, options?: object) => string} [t]
 * @returns {string} an empty string when there is nothing truthful to print.
 */
export default function formatStartingPrice(
  amount,
  currency,
  language = "en",
  t,
) {
  if (amount == null || !Number.isFinite(amount) || !currency) {
    return "";
  }

  const isArabic = String(language).startsWith("ar");
  const translate =
    typeof t === "function" ? t : (key, options) => options?.defaultValue ?? key;

  const number = new Intl.NumberFormat(isArabic ? "ar-EG-u-nu-latn" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);

  const currencyLabel = translate(`pricing.currency.${currency}`, {
    amount: number,
    defaultValue: "",
  });

  if (currencyLabel) {
    return currencyLabel;
  }

  return isArabic ? `${number} ${currency}` : `${currency} ${number}`;
}
