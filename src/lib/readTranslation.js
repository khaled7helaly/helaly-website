/**
 * Reads an i18n key without ever surfacing the raw key.
 *
 * i18next echoes the key back when a translation is missing, which would leak
 * strings like "services.items.seo.overview" into the page. Missing text becomes
 * an empty string so callers can hide the surrounding block.
 *
 * @param {(key: string, options?: object) => unknown} t
 * @param {string | undefined} key
 * @returns {string}
 */
export default function readTranslation(t, key) {
  if (typeof key !== "string" || key.length === 0) {
    return "";
  }

  const value = t(key, { defaultValue: "" });
  return typeof value === "string" ? value.trim() : "";
}
