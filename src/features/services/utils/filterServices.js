import readTranslation from "../../../lib/readTranslation";

/*
  Free-text search over the service catalogue.

  Matching runs against the *translated* title, description and category label,
  so an Arabic query matches Arabic text and an English query matches English
  text without a second index. `services.json` has no `tags` field, so nothing
  that does not exist is searched — the haystack is built only from keys that
  are actually present on the record.
*/

// Tashkeel and Quranic marks add nothing to a search term but break equality.
const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/gu;
// Alef, alef maqsura and ta marbuta are commonly typed in their plain forms.
const ALEF_VARIANTS = /[\u0622\u0623\u0625\u0627\u0671]/gu;

/**
 * @param {unknown} value
 * @param {string} language
 * @returns {string}
 */
function normalize(value, language) {
  return String(value ?? "")
    .toLocaleLowerCase(language)
    .replace(ARABIC_MARKS, "")
    .replace(ALEF_VARIANTS, "\u0627")
    .replace(/\u0649/gu, "\u064A")
    .replace(/\u0629/gu, "\u0647");
}

/**
 * Builds the searchable text for one service.
 *
 * @param {import("./services").Service} service
 * @param {(key: string, options?: object) => unknown} t
 * @param {string} language
 * @returns {string}
 */
function haystackFor(service, t, language) {
  const parts = [
    readTranslation(t, service.titleKey),
    readTranslation(t, service.descriptionKey),
    readTranslation(t, `services.categories.${service.category}.title`),
  ];

  return normalize(parts.join(" "), language);
}

/**
 * @param {import("./services").Service[]} list
 * @param {{ query?: string, t: (key: string, options?: object) => unknown, language?: string }} options
 * @returns {import("./services").Service[]}
 */
export default function filterServices(list, { query, t, language = "en" } = {}) {
  if (!Array.isArray(list)) return [];

  const needle = normalize(query, language).trim();
  if (!needle) return list;

  return list.filter((service) =>
    haystackFor(service, t, language).includes(needle),
  );
}
