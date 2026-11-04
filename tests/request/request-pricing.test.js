import assert from "node:assert/strict";
import { after, test } from "node:test";

import addons from "../../src/data/addons.json" with { type: "json" };
import services from "../../src/data/services.json" with { type: "json" };
import { createRequestTestServer } from "../helpers/requestTestServer.js";

const vite = await createRequestTestServer();
const { default: calculateOrderTotal } = await vite.ssrLoadModule(
  "/src/features/request/utils/calculateOrderTotal.js",
);

after(() => vite.close());

test("calculates a total only when every selected price uses one currency", () => {
  const service = {
    ...services[0],
    price: 100,
    currency: "USD",
  };
  const selectedAddons = [
    { ...addons[0], price: 25, currency: "USD" },
    { ...addons[1], price: 10, currency: "USD" },
  ];

  assert.deepEqual(calculateOrderTotal(service, selectedAddons), {
    amount: 135,
    currency: "USD",
  });
});

test("does not calculate totals for missing prices or mixed currencies", () => {
  const service = { ...services[0], price: 100, currency: "USD" };

  assert.equal(
    calculateOrderTotal(service, [
      { ...addons[0], price: null, currency: null },
    ]),
    null,
  );
  assert.equal(
    calculateOrderTotal(service, [
      { ...addons[0], price: 25, currency: "EGP" },
    ]),
    null,
  );
  assert.equal(calculateOrderTotal(null, []), null);
});
