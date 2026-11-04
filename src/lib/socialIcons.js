/**
 * Social glyphs, keyed by the profile id used in src/config/contact.js.
 *
 * They live in lib rather than inside one component because the hero's side
 * rail and the footer both render the same profiles, and the two must not
 * drift apart. Every entry is a list of SVG path definitions drawn on a 24x24
 * grid with stroke only, so all the marks share one visual weight.
 */
const SOCIAL_ICONS = {
  facebook: ["M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"],
  instagram: [
    "M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z",
    "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",
    "M16.5 7.5v.01",
  ],
  x: ["M4 4l16 16", "M20 4l-16 16"],
  linkedin: [
    "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z",
    "M8 11v5",
    "M8 8v.01",
    "M12 16v-5",
    "M16 16v-3a2 2 0 0 0 -4 0",
  ],
  snapchat: [
    "M16.882 7.842a4.882 4.882 0 0 0 -9.764 0c0 4.273 -.213 6.409 -4.118 8.118c2 .882 2 .882 3 3c3 0 4 2 6 2s3 -2 6 -2c1 -2.118 1 -2.118 3 -3c-3.906 -1.709 -4.118 -3.845 -4.118 -8.118z",
  ],
  tiktok: [
    "M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z",
  ],
};

export default SOCIAL_ICONS;
