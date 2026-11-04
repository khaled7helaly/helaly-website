import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createRequestTestServer } from "../helpers/requestTestServer.js";

const vite = await createRequestTestServer();
const { default: buildRequestUrl } = await vite.ssrLoadModule(
  "/src/features/request/utils/buildRequestUrl.js",
);

after(() => vite.close());

test("builds a request URL with a safely encoded service slug", () => {
  assert.equal(
    buildRequestUrl("business website / design"),
    "/request?service=business%20website%20%2F%20design",
  );
});

test("builds the empty request URL when no service slug is provided", () => {
  assert.equal(buildRequestUrl(), "/request");
  assert.equal(buildRequestUrl("  "), "/request");
});
