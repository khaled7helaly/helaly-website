import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";

import { FIXTURE_TRANSLATIONS, SERVICE_FIXTURES } from "../fixtures/services.fixture.js";
import { PROJECT_FIXTURES } from "../fixtures/projects.fixture.js";
import { createReactTestServer } from "../helpers/reactTestServer.js";

const require = createRequire(import.meta.url);
const en = require("../../src/i18n/locales/en.json");
const ar = require("../../src/i18n/locales/ar.json");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Static markup escapes quotes and apostrophes; normalising keeps assertions
// readable when a label such as "What's included" is involved.
const normalize = (html) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const countOccurrences = (html, needle) => html.split(needle).length - 1;

const readKey = (source, key) =>
  key.split(".").reduce((value, part) => value?.[part], source);

let vite;
let i18n;
let ServiceDetailsPage;
let buildRequestUrl;
let requestReducer;
let createRequestInitialState;
let SERVICES;

before(async () => {
  vite = await createReactTestServer();

  i18n = (await vite.ssrLoadModule("/src/i18n/index.js")).default;

  // Fixture copy is registered at runtime, so no sample service text ever
  // reaches the shipped locale files.
  for (const [language, resources] of Object.entries(FIXTURE_TRANSLATIONS)) {
    i18n.addResourceBundle(language, "translation", resources, true, true);
  }

  ServiceDetailsPage = (await vite.ssrLoadModule("/src/pages/ServiceDetailsPage.jsx"))
    .default;
  buildRequestUrl = (
    await vite.ssrLoadModule("/src/features/request/utils/buildRequestUrl.js")
  ).default;
  requestReducer = (
    await vite.ssrLoadModule("/src/features/request/reducers/requestReducer.js")
  ).default;
  createRequestInitialState = (
    await vite.ssrLoadModule("/src/features/request/reducers/requestInitialState.js")
  ).createRequestInitialState;
  SERVICES = (await vite.ssrLoadModule("/src/data/services.json")).default;
});

after(async () => {
  await vite?.close();
});

function renderPage({ slug, services, projects }) {
  const props = {};

  if (services !== undefined) props.services = services;
  if (projects !== undefined) props.projects = projects;

  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        MemoryRouter,
        { initialEntries: [`/services/${slug}`] },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: "/services/:slug",
            element: createElement(ServiceDetailsPage, props),
          }),
        ),
      ),
    ),
  );
}

async function renderService(options) {
  await i18n.changeLanguage(options.language ?? "en");
  return renderPage(options);
}

test("renders every section a fully configured service supports", async () => {
  const html = normalize(
    await renderService({
      slug: "fixture-full",
      services: SERVICE_FIXTURES,
      projects: PROJECT_FIXTURES,
    }),
  );

  // Hero
  assert.match(html, /Full Fixture Service/);
  assert.match(html, /Fixture description for the full service\./);
  assert.match(html, new RegExp(escapeRegExp(en.services.categories["web-development"].title)));
  assert.match(html, new RegExp(escapeRegExp(en.common.backToServices)));

  // The themed backdrop is part of the hero shell: both tone layers are
  // rendered and handed over to CSS so the hero follows the site theme.
  assert.match(html, /class="service-hero /);
  assert.match(html, /service-hero-layer--bright/);
  assert.match(html, /service-hero-layer--deep/);
  assert.match(html, /class="hm-/);

  // A configured price is shown with its label.
  assert.match(html, /1,200/);
  assert.match(html, new RegExp(escapeRegExp(en.services.startingPrice)));

  // Overview
  assert.match(html, new RegExp(escapeRegExp(en.services.overview.title)));
  assert.match(html, /Fixture overview copy\./);
  assert.match(html, /Fixture audience copy\./);
  assert.match(html, /Fixture challenge copy\./);

  // What's included: the item with an empty title is dropped.
  assert.match(html, new RegExp(escapeRegExp(en.services.included.title)));
  assert.match(html, /Fixture capability one/);
  assert.match(html, /Fixture capability two/);

  // Process: narrowed to the configured stages only.
  assert.match(html, new RegExp(escapeRegExp(en.services.process.title)));
  assert.match(html, new RegExp(escapeRegExp(en.process.steps.discover.title)));
  assert.match(html, new RegExp(escapeRegExp(en.process.steps.deliver.title)));
  // Matched on the description, because "Develop" also occurs in the
  // "Web Development" category label shown in the hero.
  assert.doesNotMatch(
    html,
    new RegExp(escapeRegExp(en.process.steps.develop.description)),
  );

  // Deliverables
  assert.match(html, new RegExp(escapeRegExp(en.services.deliverables.title)));
  assert.match(html, /Fixture deliverable one/);
  assert.match(html, /Fixture deliverable two/);

  // Related work, matched on the shared category.
  assert.match(html, new RegExp(escapeRegExp(en.services.relatedProjects.title)));
  assert.match(html, /href="\/work\/fixture-alpha"/);

  // FAQ, limited to the linked questions.
  assert.match(html, new RegExp(escapeRegExp(en.services.faq.title)));
  assert.match(html, new RegExp(escapeRegExp(en.faq.items.startProject.question)));
  assert.match(html, new RegExp(escapeRegExp(en.faq.items.projectCost.question)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.faq.items.webSolutions.question)));

  // Conversion CTA: hero action plus closing action, both prefilled.
  assert.match(html, new RegExp(escapeRegExp(en.services.cta.title)));
  assert.equal(countOccurrences(html, 'href="/request?service=fixture-full"'), 2);
  assert.equal(countOccurrences(html, new RegExp(escapeRegExp(en.services.startThisProject), "g")), 2);
  assert.match(
    html,
    new RegExp(
      escapeRegExp(en.services.cta.description.replace("{{service}}", "Full Fixture Service")),
    ),
  );
});

test("optional sections stay hidden when the service has no content for them", async () => {
  const html = normalize(
    await renderService({
      slug: "fixture-minimal",
      services: SERVICE_FIXTURES,
      projects: PROJECT_FIXTURES,
    }),
  );

  assert.match(html, /Minimal Fixture Service/);
  // No price configured: neither the amount nor its label appears.
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.startingPrice)));

  // A dangling key must not surface, and its section must not render at all.
  assert.doesNotMatch(html, /fixture\.services\.minimal\.missing/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.overview.title)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.included.title)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.deliverables.title)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.relatedProjects.title)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.faq.title)));

  // The shared process and the closing CTA are always available.
  assert.match(html, new RegExp(escapeRegExp(en.services.process.title)));
  assert.match(html, new RegExp(escapeRegExp(en.process.steps.plan.title)));
  assert.match(html, new RegExp(escapeRegExp(en.services.cta.title)));
});

test("an explicit related list wins over the shared category", async () => {
  const html = await renderService({
    slug: "fixture-sibling",
    services: SERVICE_FIXTURES,
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, /href="\/work\/fixture-charlie"/);
  assert.doesNotMatch(html, /href="\/work\/fixture-alpha"/);
  // The unknown slug is dropped rather than turned into a broken card.
  assert.doesNotMatch(html, /retired-project/);
});

test("the linked questions use the shared accordion with an accessible state", async () => {
  const html = await renderService({
    slug: "fixture-full",
    services: SERVICE_FIXTURES,
    projects: PROJECT_FIXTURES,
  });

  // First question opens by default, the second stays collapsed and inert.
  assert.equal(countOccurrences(html, 'aria-expanded="true"'), 1);
  assert.equal(countOccurrences(html, 'aria-expanded="false"'), 1);
  assert.match(html, /grid-rows-\[1fr\]/);
  assert.match(html, /grid-rows-\[0fr\]/);
  assert.equal(countOccurrences(html, 'inert=""'), 1);
  assert.match(html, /aria-controls="/);
  assert.match(html, /role="region"/);
});

test("an unknown slug renders the not found page", async () => {
  const html = await renderService({
    slug: "not-a-real-service",
    services: SERVICE_FIXTURES,
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, new RegExp(escapeRegExp(en.errors.notFoundTitle)));
  assert.doesNotMatch(html, /Full Fixture Service/);
  assert.doesNotMatch(html, /Minimal Fixture Service/);
});

test("every configured service slug resolves to its own page", async () => {
  assert.equal(
    new Set(SERVICES.map((service) => service.slug)).size,
    SERVICES.length,
    "service slugs must be unique for the dynamic route to be unambiguous",
  );

  for (const service of SERVICES) {
    const html = await renderService({ slug: service.slug });

    assert.doesNotMatch(
      html,
      new RegExp(escapeRegExp(en.errors.notFoundTitle)),
      `/${service.slug} should not fall back to the not found page`,
    );
    assert.match(
      html,
      new RegExp(escapeRegExp(readKey(en, service.titleKey))),
      `/${service.slug} should render its own title`,
    );
    assert.doesNotMatch(html, new RegExp(escapeRegExp(service.titleKey)));
  }
});

test("with the real, empty projects.json the related work section is absent", async () => {
  // No `projects` prop: the page reads src/data/projects.json, which is still [].
  const html = await renderService({ slug: "portfolio-website" });

  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.services.relatedProjects.title)));
  assert.match(
    html,
    new RegExp(escapeRegExp(readKey(en, "services.items.portfolio.title"))),
  );
});

test("the service CTA prefills the existing request reducer", async () => {
  for (const service of SERVICES) {
    const url = buildRequestUrl(service.slug);
    assert.equal(url, `/request?service=${encodeURIComponent(service.slug)}`);

    // Same resolution the wizard performs on mount: slug -> id -> SET_SERVICE.
    const requestedSlug = decodeURIComponent(url.split("service=")[1]);
    const requestedService = SERVICES.find((item) => item.slug === requestedSlug);

    assert.ok(requestedService, `${service.slug} must be resolvable by the wizard`);

    const state = requestReducer(createRequestInitialState(), {
      type: "SET_SERVICE",
      payload: requestedService.id,
    });

    assert.equal(state.selectedServiceId, service.id);
    assert.equal(state.selectedCategoryId, service.category);
  }

  // With no slug the flow opens without preselecting anything.
  assert.equal(buildRequestUrl(""), "/request");
  assert.equal(buildRequestUrl(undefined), "/request");
});

test("the page renders in Arabic", async () => {
  const html = normalize(
    await renderService({
      slug: "fixture-full",
      services: SERVICE_FIXTURES,
      projects: PROJECT_FIXTURES,
      language: "ar",
    }),
  );

  assert.match(html, /خدمة نموذج كاملة/);
  assert.match(html, new RegExp(escapeRegExp(ar.services.overview.title)));
  assert.match(html, new RegExp(escapeRegExp(ar.services.deliverables.title)));
  assert.match(html, new RegExp(escapeRegExp(ar.services.startThisProject)));
  assert.match(html, new RegExp(escapeRegExp(ar.common.backToServices)));
  assert.doesNotMatch(html, /Full Fixture Service/);
});
