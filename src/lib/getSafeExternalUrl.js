const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns the URL only when it is a well-formed http(s) address, otherwise "".
 * Project data and contact config are editable by hand, so a typo or a
 * `javascript:` value must never reach an href.
 *
 * @param {unknown} value
 * @returns {string}
 */
export default function getSafeExternalUrl(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "";
  }

  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
