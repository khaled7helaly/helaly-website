/**
 * Builds the wizard entry link.
 *
 * The service slug is enough to preselect the service. A proposal can also
 * hand over the optional features the customer already ticked, so the wizard
 * opens with the same selection instead of asking again. Ids are joined into
 * one comma-separated value to keep the URL short and readable.
 */
function buildRequestUrl(serviceSlug, addonIds = []) {
  const normalizedSlug =
    typeof serviceSlug === "string" ? serviceSlug.trim() : "";

  if (!normalizedSlug) {
    return "/request";
  }

  const params = [`service=${encodeURIComponent(normalizedSlug)}`];

  const normalizedAddonIds = Array.isArray(addonIds)
    ? [
        ...new Set(
          addonIds.filter(
            (addonId) =>
              typeof addonId === "string" && addonId.trim().length > 0,
          ),
        ),
      ]
    : [];

  if (normalizedAddonIds.length > 0) {
    params.push(`addons=${encodeURIComponent(normalizedAddonIds.join(","))}`);
  }

  return `/request?${params.join("&")}`;
}

export default buildRequestUrl;
