import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getAdjacentProjects,
  getProjectBySlug,
  sortProjectsByOrder,
} from "../../src/features/projects/utils/projects.js";
import getSafeExternalUrl from "../../src/lib/getSafeExternalUrl.js";
import readTranslation from "../../src/lib/readTranslation.js";

const fakeTranslate = (key, options) =>
  key === "known.key" ? "  Translated  " : options?.defaultValue;

const PROJECTS = [
  { slug: "third", order: 30, titleKey: "known.key" },
  { slug: "first", order: 10, titleKey: "known.key" },
  { slug: "second", order: 20, titleKey: "known.key" },
];

test("readTranslation never leaks a raw i18n key", () => {
  assert.equal(readTranslation(fakeTranslate, "known.key"), "Translated");
  assert.equal(readTranslation(fakeTranslate, "missing.key"), "");
  assert.equal(readTranslation(fakeTranslate, undefined), "");
  assert.equal(readTranslation(fakeTranslate, ""), "");
  assert.equal(readTranslation(fakeTranslate, 42), "");
});

test("sortProjectsByOrder orders by the order field without mutating the input", () => {
  const original = [...PROJECTS];

  assert.deepEqual(
    sortProjectsByOrder(PROJECTS).map((project) => project.slug),
    ["first", "second", "third"],
  );
  assert.deepEqual(PROJECTS, original);
});

test("sortProjectsByOrder tolerates a missing or non-array source", () => {
  assert.deepEqual(sortProjectsByOrder(undefined), []);
  assert.deepEqual(sortProjectsByOrder(null), []);
  assert.deepEqual(sortProjectsByOrder({}), []);
});

test("getProjectBySlug matches an exact slug and ignores surrounding whitespace", () => {
  assert.equal(getProjectBySlug(PROJECTS, "second")?.order, 20);
  assert.equal(getProjectBySlug(PROJECTS, "  second  ")?.order, 20);
});

test("getProjectBySlug returns null for unknown or unusable slugs", () => {
  assert.equal(getProjectBySlug(PROJECTS, "missing"), null);
  assert.equal(getProjectBySlug(PROJECTS, ""), null);
  assert.equal(getProjectBySlug(PROJECTS, "   "), null);
  assert.equal(getProjectBySlug(PROJECTS, undefined), null);
  assert.equal(getProjectBySlug([], "second"), null);
  assert.equal(getProjectBySlug(undefined, "second"), null);
});

test("getAdjacentProjects follows the order field, not the array position", () => {
  assert.deepEqual(
    [getAdjacentProjects(PROJECTS, "first").previous, getAdjacentProjects(PROJECTS, "first").next].map(
      (project) => project?.slug ?? null,
    ),
    [null, "second"],
  );

  const middle = getAdjacentProjects(PROJECTS, "second");
  assert.equal(middle.previous?.slug, "first");
  assert.equal(middle.next?.slug, "third");

  assert.deepEqual(
    [getAdjacentProjects(PROJECTS, "third").previous?.slug ?? null, getAdjacentProjects(PROJECTS, "third").next],
    ["second", null],
  );
});

test("getAdjacentProjects returns no neighbours for unknown slugs or a single project", () => {
  assert.deepEqual(getAdjacentProjects(PROJECTS, "missing"), {
    previous: null,
    next: null,
  });

  assert.deepEqual(getAdjacentProjects([{ slug: "only", order: 1 }], "only"), {
    previous: null,
    next: null,
  });

  assert.deepEqual(getAdjacentProjects([], "missing"), {
    previous: null,
    next: null,
  });
});

test("getSafeExternalUrl accepts http(s) and rejects everything else", () => {
  assert.equal(getSafeExternalUrl("https://example.com/work"), "https://example.com/work");
  assert.equal(getSafeExternalUrl("  http://example.com  "), "http://example.com/");

  assert.equal(getSafeExternalUrl("javascript:alert('x')"), "");
  assert.equal(getSafeExternalUrl("data:text/html,<p>x</p>"), "");
  assert.equal(getSafeExternalUrl("/images/relative.webp"), "");
  assert.equal(getSafeExternalUrl("example.com"), "");
  assert.equal(getSafeExternalUrl(""), "");
  assert.equal(getSafeExternalUrl("   "), "");
  assert.equal(getSafeExternalUrl(undefined), "");
  assert.equal(getSafeExternalUrl(null), "");
  assert.equal(getSafeExternalUrl({ href: "https://example.com" }), "");
});
