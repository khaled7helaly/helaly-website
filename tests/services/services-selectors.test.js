import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createRequestTestServer } from "../helpers/requestTestServer.js";
import { SERVICE_FIXTURES } from "../fixtures/services.fixture.js";

// The selectors read `serviceCategories.json`, so they are loaded through Vite
// to reuse the app's own module resolution instead of duplicating it here.
let vite;
let services;
let getProcessSteps;
let ORDERED_PROCESS_STEPS;

before(async () => {
  vite = await createRequestTestServer();
  services = await vite.ssrLoadModule("/src/features/services/utils/services.js");

  const processSteps = await vite.ssrLoadModule("/src/lib/processSteps.js");
  getProcessSteps = processSteps.getProcessSteps;
  ORDERED_PROCESS_STEPS = processSteps.ORDERED_PROCESS_STEPS;
});

after(async () => {
  await vite?.close();
});

const PROJECTS = [
  { slug: "third", order: 30, category: "web-development" },
  { slug: "first", order: 10, category: "web-development" },
  { slug: "other", order: 20, category: "digital-marketing" },
];

test("sortServicesByOrder orders by category, then by the service order", () => {
  assert.deepEqual(
    services.sortServicesByOrder(SERVICE_FIXTURES).map((service) => service.slug),
    ["fixture-full", "fixture-sibling", "fixture-minimal"],
  );
});

test("sortServicesByOrder does not mutate its input", () => {
  const original = SERVICE_FIXTURES.map((service) => service.slug);

  services.sortServicesByOrder(SERVICE_FIXTURES);

  assert.deepEqual(
    SERVICE_FIXTURES.map((service) => service.slug),
    original,
  );
});

test("sortServicesByOrder tolerates a missing or non-array source", () => {
  assert.deepEqual(services.sortServicesByOrder(undefined), []);
  assert.deepEqual(services.sortServicesByOrder(null), []);
  assert.deepEqual(services.sortServicesByOrder({}), []);
});

test("getServiceBySlug matches an exact slug and ignores surrounding whitespace", () => {
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, "fixture-full")?.id, "fixture-full");
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, "  fixture-full  ")?.id, "fixture-full");
});

test("getServiceBySlug returns null for unknown or unusable slugs", () => {
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, "missing"), null);
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, ""), null);
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, "   "), null);
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, undefined), null);
  assert.equal(services.getServiceBySlug(SERVICE_FIXTURES, 42), null);
  assert.equal(services.getServiceBySlug([], "fixture-full"), null);
  assert.equal(services.getServiceBySlug(undefined, "fixture-full"), null);
});

test("getServicesByCategory returns only that category, already ordered", () => {
  assert.deepEqual(
    services.getServicesByCategory(SERVICE_FIXTURES, "web-development").map((service) => service.slug),
    ["fixture-full", "fixture-sibling"],
  );
  assert.deepEqual(services.getServicesByCategory(SERVICE_FIXTURES, "unknown"), []);
});

test("getServiceOrdinal counts inside the category, not the whole catalogue", () => {
  const full = SERVICE_FIXTURES.find((service) => service.slug === "fixture-full");
  const sibling = SERVICE_FIXTURES.find((service) => service.slug === "fixture-sibling");
  const minimal = SERVICE_FIXTURES.find((service) => service.slug === "fixture-minimal");

  assert.equal(services.getServiceOrdinal(SERVICE_FIXTURES, full), 1);
  assert.equal(services.getServiceOrdinal(SERVICE_FIXTURES, sibling), 2);
  assert.equal(services.getServiceOrdinal(SERVICE_FIXTURES, minimal), 1);

  assert.equal(services.getServiceOrdinal(SERVICE_FIXTURES, { slug: "missing", category: "web-development" }), 0);
  assert.equal(services.getServiceOrdinal(SERVICE_FIXTURES, undefined), 0);
});

test("getRelatedProjects matches on the shared category and respects the limit", () => {
  const related = services.getRelatedProjects(PROJECTS, { category: "web-development" });

  assert.deepEqual(related.map((project) => project.slug), ["first", "third"]);
  assert.deepEqual(
    services.getRelatedProjects(PROJECTS, { category: "web-development" }, 1).map((project) => project.slug),
    ["first"],
  );
});

test("an explicit relatedProjectSlugs list wins and drops unknown slugs", () => {
  const related = services.getRelatedProjects(PROJECTS, {
    category: "web-development",
    relatedProjectSlugs: ["third", "retired-project"],
  });

  assert.deepEqual(related.map((project) => project.slug), ["third"]);
});

test("getRelatedProjects returns nothing while the portfolio is empty", () => {
  assert.deepEqual(services.getRelatedProjects([], { category: "web-development" }), []);
  assert.deepEqual(services.getRelatedProjects(undefined, { category: "web-development" }), []);
  assert.deepEqual(services.getRelatedProjects(PROJECTS, {}), []);
  assert.deepEqual(services.getRelatedProjects(PROJECTS, undefined), []);
});

test("getProcessSteps falls back to the full shared process", () => {
  assert.equal(getProcessSteps(undefined).length, 5);
  assert.equal(getProcessSteps([]).length, 5);
  assert.deepEqual(
    getProcessSteps(undefined).map((step) => step.id),
    ORDERED_PROCESS_STEPS.map((step) => step.id),
  );
});

test("getProcessSteps narrows to the requested ids in canonical order", () => {
  assert.deepEqual(
    getProcessSteps(["deliver", "discover"]).map((step) => step.id),
    ["discover", "deliver"],
  );

  // An id that no longer exists narrows the section instead of breaking it.
  assert.deepEqual(
    getProcessSteps(["plan", "retired-stage"]).map((step) => step.id),
    ["plan"],
  );

  assert.deepEqual(getProcessSteps(["retired-stage"]), []);
});

test("every step keeps a resolved icon component instead of its raw name", () => {
  for (const step of ORDERED_PROCESS_STEPS) {
    assert.ok(step.Icon);
    assert.notEqual(typeof step.Icon, "string");
  }
});
