import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";

import {
  FIXTURE_TRANSLATIONS,
  PROJECT_FIXTURES,
} from "../fixtures/projects.fixture.js";
import { createReactTestServer } from "../helpers/reactTestServer.js";

const require = createRequire(import.meta.url);
const en = require("../../src/i18n/locales/en.json");
const ar = require("../../src/i18n/locales/ar.json");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let vite;
let i18n;
let ProjectDetailsPage;
let WorkPage;

before(async () => {
  vite = await createReactTestServer();

  i18n = (await vite.ssrLoadModule("/src/i18n/index.js")).default;

  // Fixture copy is injected here, so no sample project text ever reaches the
  // shipped locale files.
  for (const [language, resources] of Object.entries(FIXTURE_TRANSLATIONS)) {
    i18n.addResourceBundle(language, "translation", resources, true, true);
  }

  ProjectDetailsPage = (await vite.ssrLoadModule("/src/pages/ProjectDetailsPage.jsx"))
    .default;
  WorkPage = (await vite.ssrLoadModule("/src/pages/WorkPage.jsx")).default;
});

after(async () => {
  await vite?.close();
});

function renderCaseStudy({ slug, projects }) {
  const page =
    projects === undefined
      ? createElement(ProjectDetailsPage)
      : createElement(ProjectDetailsPage, { projects });

  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(
        MemoryRouter,
        { initialEntries: [`/work/${slug}`] },
        createElement(
          Routes,
          null,
          createElement(Route, { path: "/work/:slug", element: page }),
        ),
      ),
    ),
  );
}

async function renderProject(options) {
  await i18n.changeLanguage(options.language ?? "en");
  return renderCaseStudy(options);
}

const countOccurrences = (html, needle) => html.split(needle).length - 1;

test("renders every section a complete project supports", async () => {
  const html = await renderProject({
    slug: "fixture-alpha",
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, /Alpha Fixture/);
  assert.match(html, /Fixture summary for the alpha project\./);

  assert.match(html, new RegExp(escapeRegExp(en.projects.overview)));
  assert.match(html, /Fixture overview copy\./);
  assert.match(html, new RegExp(escapeRegExp(en.projects.challenge)));
  assert.match(html, /Fixture challenge copy\./);
  assert.match(html, new RegExp(escapeRegExp(en.projects.solution)));
  assert.match(html, /Fixture solution copy\./);

  assert.match(html, new RegExp(escapeRegExp(en.projects.features)));
  assert.match(html, /Fixture feature one/);
  assert.match(html, /Fixture feature two/);

  assert.match(html, new RegExp(escapeRegExp(en.projects.technologiesLabel)));
  assert.match(html, /React/);

  assert.match(html, /href="https:\/\/example\.com\/preview"/);
  assert.match(html, /href="https:\/\/example\.com\/repository"/);

  // Cover image is eager, the three gallery images are lazy.
  assert.match(html, /alpha-cover\.webp/);
  assert.match(html, /loading="eager"/);
  assert.equal(countOccurrences(html, "Enlarge image"), 3);
});

test("skips fields that have no content instead of printing translation keys", async () => {
  const html = await renderProject({
    slug: "fixture-alpha",
    projects: PROJECT_FIXTURES,
  });

  // The third fixture feature only has an empty title, so it is dropped.
  assert.doesNotMatch(html, /fixture\.projects\.alpha\.missingFeature/);
  assert.equal(countOccurrences(html, ">Fixture feature one<"), 1);
  assert.equal(countOccurrences(html, ">Fixture feature two<"), 1);
});

test("renders only the hero and closing navigation for a minimal project", async () => {
  const html = await renderProject({
    slug: "fixture-bravo",
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, /Bravo Fixture/);
  assert.match(html, /Fixture summary for the bravo project\./);

  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.overview)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.features)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.gallery)));
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.technologiesLabel)));

  // No thumbnail: the hero falls back to the typographic composition.
  assert.match(html, /max-w-\[22ch\]/);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.liveDemo)));
});

test("a project with a thumbnail uses the image instead of the typographic fallback", async () => {
  const html = await renderProject({
    slug: "fixture-alpha",
    projects: PROJECT_FIXTURES,
  });

  assert.doesNotMatch(html, /max-w-\[22ch\]/);
  assert.match(html, /alt="Alpha Fixture"/);
});

test("a single gallery image renders one item", async () => {
  const html = await renderProject({
    slug: "fixture-charlie",
    projects: PROJECT_FIXTURES,
  });

  assert.equal(countOccurrences(html, "Enlarge image"), 1);
  assert.match(html, /charlie-detail\.webp/);
});

test("never renders an unsafe live preview url", async () => {
  const html = await renderProject({
    slug: "fixture-charlie",
    projects: PROJECT_FIXTURES,
  });

  assert.doesNotMatch(html, /javascript:/);
  assert.doesNotMatch(html, new RegExp(escapeRegExp(en.projects.liveDemo)));
});

test("previous and next follow the project order, not the array position", async () => {
  const middle = await renderProject({
    slug: "fixture-bravo",
    projects: PROJECT_FIXTURES,
  });

  assert.match(middle, /href="\/work\/fixture-alpha"/);
  assert.match(middle, /href="\/work\/fixture-charlie"/);
  assert.match(middle, new RegExp(escapeRegExp(en.projects.previousProject)));
  assert.match(middle, new RegExp(escapeRegExp(en.projects.nextProject)));

  const first = await renderProject({
    slug: "fixture-alpha",
    projects: PROJECT_FIXTURES,
  });

  assert.doesNotMatch(first, new RegExp(escapeRegExp(en.projects.previousProject)));
  assert.match(first, new RegExp(escapeRegExp(en.projects.nextProject)));

  const last = await renderProject({
    slug: "fixture-charlie",
    projects: PROJECT_FIXTURES,
  });

  assert.match(last, new RegExp(escapeRegExp(en.projects.previousProject)));
  assert.doesNotMatch(last, new RegExp(escapeRegExp(en.projects.nextProject)));
});

test("the closing navigation always offers the index and the request route", async () => {
  const html = await renderProject({
    slug: "fixture-bravo",
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, /href="\/work"/);
  assert.match(html, /href="\/request"/);
  assert.match(html, new RegExp(escapeRegExp(en.projects.startSimilar)));
});

test("an unknown slug renders the not found page", async () => {
  const html = await renderProject({
    slug: "not-a-real-project",
    projects: PROJECT_FIXTURES,
  });

  assert.match(html, new RegExp(escapeRegExp(en.errors.notFoundTitle)));
  assert.doesNotMatch(html, /Alpha Fixture/);
  assert.doesNotMatch(html, /Bravo Fixture/);
});

test("with the real, empty projects.json every slug is not found", async () => {
  // No `projects` prop: the page reads src/data/projects.json, which is still [].
  const html = await renderProject({ slug: "fixture-alpha" });

  assert.match(html, new RegExp(escapeRegExp(en.errors.notFoundTitle)));
  assert.doesNotMatch(html, /Alpha Fixture/);
});

test("the work index keeps its empty state while no projects exist", async () => {
  await i18n.changeLanguage("en");

  const html = renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(MemoryRouter, null, createElement(WorkPage)),
    ),
  );

  assert.match(html, new RegExp(escapeRegExp(en.projects.empty.title)));
  assert.match(html, new RegExp(escapeRegExp(en.projects.empty.description)));
});

test("the case study renders in Arabic", async () => {
  const html = await renderProject({
    slug: "fixture-alpha",
    projects: PROJECT_FIXTURES,
    language: "ar",
  });

  assert.match(html, /نموذج ألفا/);
  assert.match(html, new RegExp(escapeRegExp(ar.projects.overview)));
  assert.match(html, new RegExp(escapeRegExp(ar.projects.gallery)));
  assert.match(html, new RegExp(escapeRegExp(ar.common.backToProjects)));
  assert.doesNotMatch(html, /Alpha Fixture/);
});
