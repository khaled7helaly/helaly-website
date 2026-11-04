import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createRequestTestServer } from "../helpers/requestTestServer.js";

const vite = await createRequestTestServer();
const { default: requestInitialState } = await vite.ssrLoadModule(
  "/src/features/request/reducers/requestInitialState.js",
);
const { default: validateRequest } = await vite.ssrLoadModule(
  "/src/features/request/utils/validateRequest.js",
);

after(() => vite.close());

test("requires a matching service and customer contact details", () => {
  const result = validateRequest(requestInitialState);

  assert.equal(result.isValid, false);
  assert.deepEqual(
    result.errors.map((error) => error.field),
    ["selectedCategoryId", "selectedServiceId", "fullName", "whatsapp"],
  );
});

test("validates optional budgets when supplied", () => {
  assert.equal(validateRequest(requestInitialState, 2).isValid, true);
  assert.equal(
    validateRequest({ ...requestInitialState, budgetAmount: "0" }, 2).isValid,
    true,
  );
  assert.equal(
    validateRequest({ ...requestInitialState, budgetAmount: "12.5" }, 2)
      .isValid,
    true,
  );

  for (const budgetAmount of ["-1", "NaN", "Infinity"]) {
    assert.equal(
      validateRequest({ ...requestInitialState, budgetAmount }, 2).isValid,
      false,
      `Expected ${budgetAmount} to be rejected`,
    );
  }
});

test("accepts a blank optional email and rejects a malformed one", () => {
  const request = {
    ...requestInitialState,
    customer: {
      fullName: "Example Customer",
      whatsapp: "+44 20 7946 0958",
      email: "",
    },
  };

  assert.equal(validateRequest(request, 3).isValid, true);
  assert.equal(
    validateRequest(
      {
        ...request,
        customer: { ...request.customer, email: "not-an-email" },
      },
      3,
    ).errors[0].field,
    "email",
  );
});

test("neither the project details nor the extras block the first step", () => {
  const withService = {
    ...requestInitialState,
    selectedCategoryId: "portfolio-websites",
    selectedServiceId: "portfolio",
  };

  // The service is the only thing step 1 insists on; the description, the
  // project type and the add-ons are all answers the customer may skip.
  assert.equal(validateRequest(withService, 1).isValid, true);

  // The budget and timeline step asks for nothing on its own.
  assert.equal(validateRequest(requestInitialState, 2).isValid, true);
});

test("requires a description when the timeline is set to other", () => {
  const otherTimeline = {
    ...requestInitialState,
    expectedTimeline: "other",
    expectedTimelineOther: "   ",
  };

  assert.deepEqual(
    validateRequest(otherTimeline, 2).errors.map((error) => error.field),
    ["expectedTimelineOther"],
  );
  assert.equal(
    validateRequest(
      { ...otherTimeline, expectedTimelineOther: "Within three months" },
      2,
    ).isValid,
    true,
  );
});
