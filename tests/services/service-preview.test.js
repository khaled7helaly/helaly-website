import assert from "node:assert/strict";
import { test } from "node:test";

import services from "../../src/data/services.json" with { type: "json" };
import {
  SERVICE_PREVIEWS,
  getPreview,
} from "../../src/features/services/preview/previewMap.js";

/**
 * The laptop screens are drawn per service, so the mapping between the two is
 * data that can rot: a service added to services.json would silently inherit a
 * category default, and two services could end up on the same frame.
 */
test("every published service has a screen of its own", () => {
  const seen = new Map();

  for (const service of services) {
    const preview = SERVICE_PREVIEWS[service.slug];

    assert.ok(preview, `${service.slug} has no laptop preview`);
    assert.equal(typeof preview.layout, "string");
    assert.ok(Number.isInteger(preview.accentIndex) && preview.accentIndex >= 0);
    assert.ok(preview.accentIndex < 6, `${service.slug} accentIndex out of range`);

    const frame = `${preview.layout}:${preview.variant ?? "default"}`;
    assert.equal(
      seen.get(frame),
      undefined,
      `${service.slug} and ${seen.get(frame)} share the ${frame} screen`,
    );
    seen.set(frame, service.slug);
  }
});

test("the mapping does not invent services", () => {
  const slugs = new Set(services.map((service) => service.slug));

  for (const slug of Object.keys(SERVICE_PREVIEWS)) {
    assert.ok(slugs.has(slug), `${slug} is not in services.json`);
  }
});

test("an unmapped service still gets its category's frame", () => {
  const preview = getPreview({
    slug: "brand-new-service",
    category: "digital-marketing",
    ordinal: 4,
  });

  assert.equal(preview.layout, "analytics");
  assert.equal(preview.accentIndex, 4);
});
