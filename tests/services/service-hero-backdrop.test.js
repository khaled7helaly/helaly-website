import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createReactTestServer } from "../helpers/reactTestServer.js";

/**
 * The Service Hero backdrop follows the site theme and gives every service its
 * own composition. These tests lock the two properties that are easy to break
 * by accident: every configured service resolves to a distinct motif, and both
 * tone layers are always rendered so the CSS cross-fade works.
 */

let vite;
let Services;
let getHeroComposition;
let SERVICE_HERO_COMPOSITIONS;
let CATEGORY_HERO_COMPOSITIONS;
let ServiceHeroBackdrop;

before(async () => {
  vite = await createReactTestServer();

  const compositions = await vite.ssrLoadModule(
    "/src/features/services/hero/heroCompositions.js",
  );
  getHeroComposition = compositions.getHeroComposition;
  SERVICE_HERO_COMPOSITIONS = compositions.SERVICE_HERO_COMPOSITIONS;
  CATEGORY_HERO_COMPOSITIONS = compositions.CATEGORY_HERO_COMPOSITIONS;

  Services = (await vite.ssrLoadModule("/src/data/services.json")).default;

  ServiceHeroBackdrop = (
    await vite.ssrLoadModule(
      "/src/features/services/components/ServiceHeroBackdrop.jsx",
    )
  ).default;
});

after(async () => {
  await vite?.close();
});

const countOccurrences = (html, needle) => html.split(needle).length - 1;

const renderBackdrop = (service) =>
  renderToStaticMarkup(createElement(ServiceHeroBackdrop, { service }));

test("every configured service resolves to a motif component", () => {
  for (const service of Services) {
    const { Motif, motifId } = getHeroComposition(service);

    assert.equal(
      typeof Motif,
      "function",
      `${service.slug} resolved no motif component`,
    );
    assert.equal(typeof motifId, "string");
    assert.ok(motifId.length > 0);
  }
});

test("every configured service has its own motif", () => {
  const motifs = Services.map(
    (service) => getHeroComposition(service).motifId,
  );

  assert.equal(
    new Set(motifs).size,
    Services.length,
    `expected ${Services.length} distinct motifs, got ${new Set(motifs).size}`,
  );
});

test("the composition table matches the configured services exactly", () => {
  const configuredSlugs = Services.map((service) => service.slug).sort();
  const tableSlugs = Object.keys(SERVICE_HERO_COMPOSITIONS).sort();

  assert.deepEqual(tableSlugs, configuredSlugs);
});

test("compositions expose well-formed CSS bloom and grid values", () => {
  const percentages = new Set();

  for (const service of Services) {
    const { style } = getHeroComposition(service);

    for (const key of [
      "--hero-bloom-x",
      "--hero-bloom-2-x",
      "--hero-bloom-y",
      "--hero-bloom-2-y",
    ]) {
      assert.match(style[key], /^\d{1,3}%$/, `${service.slug} ${key}`);

      const value = Number.parseInt(style[key], 10);
      assert.ok(
        value >= 0 && value <= 100,
        `${service.slug} ${key} out of range`,
      );
      percentages.add(style[key]);
    }

    assert.match(style["--hero-grid-size"], /^\d{2,3}px$/, service.slug);
  }

  // Anchors and grid rhythm are what differentiate two services that happen to
  // share a category, so they must not collapse onto one value.
  assert.ok(percentages.size > 4);
});

test("an unknown slug falls back to its category composition", () => {
  const { motifId } = getHeroComposition({
    slug: "not-a-configured-service",
    category: "digital-marketing",
  });

  assert.equal(motifId, CATEGORY_HERO_COMPOSITIONS["digital-marketing"].motif);
});

test("a service with no known slug or category still gets a backdrop", () => {
  const composition = getHeroComposition({});

  assert.equal(typeof composition.Motif, "function");
  assert.match(composition.style["--hero-grid-size"], /^\d+px$/);
});

test("the backdrop renders both tone layers and stays decorative", () => {
  const html = renderBackdrop(Services[0]);

  assert.match(html, /service-hero-layer--bright/);
  assert.match(html, /service-hero-layer--deep/);

  // The luminous tone shows while the site is light, the deep one while the
  // site is dark: the hero follows the theme instead of inverting against it.
  assert.match(html, /service-hero-layer--bright[^"]*opacity-100 dark:opacity-0/);
  assert.match(html, /service-hero-layer--deep[^"]*opacity-0 dark:opacity-100/);

  // Painted behind the hero content, and never announced to assistive tech.
  assert.match(html, /-z-10/);
  assert.match(html, /aria-hidden="true"/);

  // One motif copy per tone layer.
  assert.equal(countOccurrences(html, "<svg"), 2);
  assert.match(html, /class="service-hero-motif rtl:-scale-x-100"/);
});

test("the backdrop carries the service's own bloom and grid settings", () => {
  const portfolio = Services.find(
    (service) => service.slug === "portfolio-website",
  );

  const html = renderBackdrop(portfolio);
  const { style } = getHeroComposition(portfolio);

  for (const [property, value] of Object.entries(style)) {
    assert.ok(
      html.includes(`${property}:${value}`),
      `${property}:${value} missing from the rendered style`,
    );
  }
});
