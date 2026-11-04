import assert from "node:assert/strict";
import { after, test } from "node:test";

import ar from "../../src/i18n/locales/ar.json" with { type: "json" };
import en from "../../src/i18n/locales/en.json" with { type: "json" };
import { createRequestTestServer } from "../helpers/requestTestServer.js";

/**
 * The review screen and the WhatsApp message now share one resolver. These
 * tests pin the pieces that used to be duplicated: which records are resolved
 * from an id, how a custom timeline is labelled, and when a budget counts as
 * provided. If the resolver drifts, both consumers drift with it — which is
 * exactly what these assertions are meant to catch.
 */

const vite = await createRequestTestServer();
const { default: getRequestSelection } = await vite.ssrLoadModule(
  "/src/features/request/utils/getRequestSelection.js",
);
const { default: requestInitialState } = await vite.ssrLoadModule(
  "/src/features/request/reducers/requestInitialState.js",
);

after(() => vite.close());

const translate =
  (locale) =>
  (key) =>
    key.split(".").reduce((value, part) => value?.[part], locale) ?? key;

const withState = (overrides) => ({ ...requestInitialState, ...overrides });

test("resolves the service and derives its category", () => {
  const selection = getRequestSelection(
    withState({ selectedCategoryId: "", selectedServiceId: "portfolio" }),
    { t: translate(en), language: "en" },
  );

  assert.equal(selection.service.id, "portfolio");
  assert.equal(selection.category.id, "portfolio-websites");
});

test("resolves the answers a service asks for, in the order the form shows them", () => {
  const selection = getRequestSelection(
    withState({
      selectedServiceId: "store",
      serviceFields: { productCount: "120" },
    }),
    { t: translate(en), language: "en" },
  );

  assert.deepEqual(selection.extraFields, [
    {
      id: "productCount",
      labelKey: "services.request.fields.productCount.label",
      value: "120",
    },
  ]);
});

test("ignores service answers whose service does not ask for them", () => {
  const selection = getRequestSelection(
    withState({
      selectedServiceId: "portfolio",
      // Left over from another service, and blank besides.
      serviceFields: { eventDate: "2027-05-14", productCount: "   " },
    }),
    { t: translate(en), language: "en" },
  );

  assert.deepEqual(selection.extraFields, []);
});

test("resolves only add-ons that exist in the catalog", () => {
  const selection = getRequestSelection(
    withState({ selectedAddonIds: ["contact-form", "no-such-addon"] }),
  );

  assert.deepEqual(
    selection.addons.map((addon) => addon.id),
    ["contact-form"],
  );
});

test("labels a custom timeline and falls back to the generic one", () => {
  const custom = getRequestSelection(
    withState({ expectedTimeline: "other", expectedTimelineOther: "  Spring  " }),
    { t: translate(en), language: "en" },
  );
  const generic = getRequestSelection(
    withState({ expectedTimeline: "other", expectedTimelineOther: "   " }),
    { t: translate(en), language: "en" },
  );

  assert.equal(custom.timelineLabel, "Spring");
  assert.equal(generic.timelineLabel, en.requestOptions.timelines.other);
});

test("treats a blank budget as absent and formats a supplied one", () => {
  const blank = getRequestSelection(withState({ budgetAmount: "" }), {
    t: translate(en),
    language: "en",
  });
  const supplied = getRequestSelection(
    withState({ budgetAmount: "1200", budgetCurrency: "USD" }),
    { t: translate(en), language: "en" },
  );

  assert.equal(blank.budget, null);
  assert.ok(supplied.budget.hasCurrency);
  assert.equal(supplied.budget.amount, 1200);
  assert.match(supplied.budget.formatted, /USD/);
  assert.match(supplied.budget.formatted, /1,200/);
});

test("formats the budget in the customer's locale", () => {
  const arabic = getRequestSelection(
    withState({ budgetAmount: "1200", budgetCurrency: "USD" }),
    { t: translate(ar), language: "ar" },
  );

  // The currency code stays Latin so the business can read the amount, while
  // the digits and separators follow the Arabic locale.
  assert.match(arabic.budget.formatted, /USD/);
  assert.notEqual(arabic.budget.formatted, "USD 1,200.00");
});

test("resolves an empty request without throwing", () => {
  const selection = getRequestSelection(requestInitialState);

  assert.equal(selection.service, null);
  assert.equal(selection.category, null);
  assert.deepEqual(selection.addons, []);
  assert.equal(selection.budget, null);
  assert.equal(selection.timelineLabel, null);
});
