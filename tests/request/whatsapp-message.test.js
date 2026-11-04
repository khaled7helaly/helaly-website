import assert from "node:assert/strict";
import { after, test } from "node:test";

import addons from "../../src/data/addons.json" with { type: "json" };
import categories from "../../src/data/serviceCategories.json" with {
  type: "json",
};
import en from "../../src/i18n/locales/en.json" with { type: "json" };
import ar from "../../src/i18n/locales/ar.json" with { type: "json" };
import requestOptions from "../../src/data/requestOptions.json" with {
  type: "json",
};
import services from "../../src/data/services.json" with { type: "json" };
import contact from "../../src/config/contact.js";
import { createRequestTestServer } from "../helpers/requestTestServer.js";

const vite = await createRequestTestServer();
const { default: buildWhatsAppMessage } = await vite.ssrLoadModule(
  "/src/features/request/utils/buildWhatsAppMessage.js",
);

after(() => vite.close());

// Languages use different ICU plural categories (Arabic has zero/two/few/many,
// English only one/other), so plural variants collapse to the base key.
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const keyShape = (value) =>
  Array.isArray(value)
    ? value.map(keyShape)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .map((key) => [key.replace(PLURAL_SUFFIX, ""), keyShape(value[key])])
            .sort(([a], [b]) => a.localeCompare(b)),
        )
      : true;

const translate =
  (locale) =>
  (key) =>
    key.split(".").reduce((value, part) => value?.[part], locale) ?? key;

const hasTranslation = (locale, key) =>
  key.split(".").every((part) => {
    if (locale == null || !Object.hasOwn(locale, part)) {
      return false;
    }

    locale = locale[part];
    return true;
  });

const request = {
  selectedCategoryId: "web-development",
  selectedServiceId: "portfolio",
  selectedProjectType: "redesign",
  selectedAddonIds: ["contact-form"],
  projectDescription: "A responsive business website",
  serviceFields: {},
  budgetAmount: "1200",
  budgetCurrency: "USD",
  expectedTimeline: "other",
  expectedTimelineOther: "Within three months",
  customer: {
    fullName: "Example Customer",
    whatsapp: "+44 20 7946 0958",
    email: "customer@example.org",
  },
};

test("English and Arabic locale trees have identical keys", () => {
  assert.deepEqual(keyShape(en), keyShape(ar));
});

test("catalog and request-option translation keys exist in both locales", () => {
  const rows = [
    ...services,
    ...categories,
    ...addons,
    ...Object.values(requestOptions).flat(),
  ];

  for (const locale of [en, ar]) {
    for (const row of rows) {
      for (const key of [row.titleKey, row.descriptionKey, row.labelKey]) {
        if (key) {
          assert.equal(hasTranslation(locale, key), true, `Missing ${key}`);
        }
      }
    }
  }
});

test("generates English and Arabic messages from translated catalog data", () => {
  const english = buildWhatsAppMessage({
    state: request,
    t: translate(en),
    language: "en",
  });
  const arabic = buildWhatsAppMessage({
    state: request,
    t: translate(ar),
    language: "ar",
  });

  assert.match(english, new RegExp(en.services.items.portfolio.title));
  assert.match(english, /Contact Form/);
  assert.match(english, /Your budget:.*USD/);
  assert.match(english, /Within three months/);

  // Section headers and labels use WhatsApp's bold markup so the bubble stays
  // scannable instead of relying on capitals alone.
  assert.match(english, /\*PROJECT DETAILS\*/);
  assert.match(english, /\*CONTACT INFORMATION\*/);
  assert.match(english, /\*Your budget:\* USD/);
  assert.match(arabic, /\*تفاصيل المشروع\*/);
  assert.match(arabic, new RegExp(ar.services.items.portfolio.title));
  assert.match(arabic, new RegExp(ar.request.addons.items.contactForm.title));
  assert.match(arabic, /USD/);
  assert.doesNotMatch(english, /services\.items\.portfolio\.title/);
  assert.match(contact.whatsappBusinessNumber, /^\d+$/);
});

test("omits unselected optional values and ignores unknown add-on IDs", () => {
  const minimalRequest = {
    ...request,
    selectedProjectType: "",
    selectedAddonIds: ["contact-form", "unknown-addon"],
    projectDescription: "",
    budgetAmount: "",
    budgetCurrency: "",
    expectedTimeline: "",
    expectedTimelineOther: "",
    customer: {
      fullName: "Example Customer",
      whatsapp: "+44 20 7946 0958",
      email: "",
    },
  };
  const message = buildWhatsAppMessage({
    state: minimalRequest,
    t: translate(en),
    language: "en",
  });

  assert.doesNotMatch(message, /Your budget|Expected timeline|Email address/);
  assert.doesNotMatch(message, /Project description|Project type/);
  assert.match(message, /Contact Form/);
  assert.doesNotMatch(message, /unknown-addon/);
});
