/**
 * Service → laptop screen mapping.
 *
 * The laptop is a preview of the work, not a screenshot of it, so each service
 * gets the screen *shape* its deliverable actually has: a store shows product
 * tiles, a research engagement shows a response heatmap, a maintenance plan
 * shows uptime. Services that share a shape are separated by `variant` and by
 * which element carries the accent (`accentIndex`), so no two heroes render
 * the same frame.
 *
 * Only services declared in src/data/services.json appear here — nothing is
 * invented. The layouts themselves live in ./screenLayouts.jsx, and an unknown
 * layout there falls back to the default screen rather than rendering nothing.
 *
 * Deliberately a plain module (no JSX, no imports) so
 * tests/services/service-preview.test.js can load it with `node --test`.
 */

export const SERVICE_PREVIEWS = {
  // Web development
  "portfolio-website": { layout: "portfolio", accentIndex: 1 },
  "wedding-website": { layout: "landing", accentIndex: 2 },
  "startup-website": { layout: "business", accentIndex: 3 },
  "online-store": { layout: "store", accentIndex: 4 },
  "company-website": { layout: "business", variant: "corporate", accentIndex: 0 },
  "academy-website": { layout: "analytics", variant: "funnel", accentIndex: 3 },
  "restaurant-website": { layout: "store", variant: "menu", accentIndex: 2 },
  "tourism-website": { layout: "portfolio", variant: "editorial", accentIndex: 5 },
  "small-business-website": { layout: "mobile", accentIndex: 3 },

  // Applications
  "web-app": { layout: "dashboard", accentIndex: 5 },

  // UI/UX design
  "ui-ux-design": { layout: "designSystem", accentIndex: 0 },

  // Digital marketing
  "digital-marketing": { layout: "social", accentIndex: 1 },
};

// Used only when a service is published before its screen is designed: the
// hero then shows its category's most characteristic layout.
const CATEGORY_LAYOUT = {
  "web-development": "business",
  applications: "dashboard",
  "ui-ux-design": "designSystem",
  "digital-marketing": "analytics",
};

// Layouts pick an accent slot with `accentIndex % n` for n between 3 and 6.
const ACCENT_SLOTS = 6;

export function getPreview({ slug, category, ordinal = 0 } = {}) {
  const mapped = SERVICE_PREVIEWS[slug];
  if (mapped) return mapped;

  return {
    layout: CATEGORY_LAYOUT[category],
    accentIndex: Math.abs(ordinal) % ACCENT_SLOTS,
  };
}

export default getPreview;
