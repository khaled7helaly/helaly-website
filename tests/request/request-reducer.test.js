import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createRequestTestServer } from "../helpers/requestTestServer.js";

const vite = await createRequestTestServer();
const { default: requestInitialState } = await vite.ssrLoadModule(
  "/src/features/request/reducers/requestInitialState.js",
);
const { default: requestReducer } = await vite.ssrLoadModule(
  "/src/features/request/reducers/requestReducer.js",
);

after(() => vite.close());

test("clears the selected service and incompatible add-ons on category change", () => {
  const state = {
    ...requestInitialState,
    selectedCategoryId: "web-development",
    selectedServiceId: "portfolio",
    selectedAddonIds: ["contact-form"],
  };

  const nextState = requestReducer(state, {
    type: "SET_CATEGORY",
    payload: "ui-ux-design",
  });

  assert.equal(nextState.selectedCategoryId, "ui-ux-design");
  assert.equal(nextState.selectedServiceId, "");
  assert.deepEqual(nextState.selectedAddonIds, []);
});

test("retains compatible add-ons and removes service-specific incompatible add-ons", () => {
  let state = requestReducer(requestInitialState, {
    type: "SET_SERVICE",
    payload: "marketing",
  });
  state = requestReducer(state, {
    type: "TOGGLE_ADDON",
    payload: "seo-setup",
  });

  assert.deepEqual(state.selectedAddonIds, ["seo-setup"]);

  // SEO setup belongs to marketing alone, so switching to a website drops it.
  state = requestReducer(state, {
    type: "SET_SERVICE",
    payload: "portfolio",
  });
  assert.deepEqual(state.selectedAddonIds, []);

  state = requestReducer(state, {
    type: "TOGGLE_ADDON",
    payload: "contact-form",
  });
  state = requestReducer(state, {
    type: "SET_SERVICE",
    payload: "store",
  });

  // Both are websites, so this add-on survives the move.
  assert.deepEqual(state.selectedAddonIds, ["contact-form"]);
});

test("keeps only the service-specific answers the new service asks for", () => {
  let state = requestReducer(requestInitialState, {
    type: "SET_SERVICE",
    payload: "wedding",
  });
  state = requestReducer(state, {
    type: "SET_SERVICE_FIELD",
    payload: { field: "eventDate", value: "2027-05-14" },
  });

  assert.deepEqual(state.serviceFields, { eventDate: "2027-05-14" });

  // A store never asks for a wedding date.
  state = requestReducer(state, {
    type: "SET_SERVICE",
    payload: "store",
  });

  assert.deepEqual(state.serviceFields, {});
});

test("updates customer fields and resets all request data", () => {
  const state = requestReducer(requestInitialState, {
    type: "SET_CUSTOMER_FIELD",
    payload: { field: "fullName", value: "Example Customer" },
  });

  assert.equal(state.customer.fullName, "Example Customer");
  assert.equal(
    requestReducer(state, { type: "RESET_REQUEST" }).customer.fullName,
    "",
  );
  assert.deepEqual(
    requestReducer(state, { type: "RESET_REQUEST" }),
    requestInitialState,
  );
});
