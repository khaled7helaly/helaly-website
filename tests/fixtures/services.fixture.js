/**
 * TEMPORARY TEST FIXTURES — never imported by application code.
 *
 * `src/data/services.json` holds real services but no scope detail yet, so these
 * records exist only to exercise the optional half of the service schema:
 * overview, capabilities, deliverables, narrowed process steps, linked
 * questions and related work. Their copy is registered with i18next at runtime
 * from this file, so no sample text reaches `src/i18n/locales/*.json`.
 *
 * Array order deliberately differs from `order` so the order-driven selectors
 * are actually covered.
 */
export const SERVICE_FIXTURES = [
  {
    id: "fixture-minimal",
    slug: "fixture-minimal",
    category: "ui-ux-design",
    order: 1,
    titleKey: "fixture.services.minimal.title",
    descriptionKey: "fixture.services.minimal.description",
    // Dangling keys: the section must disappear instead of printing the key.
    overviewKey: "fixture.services.minimal.missingOverview",
    deliverables: [
      { titleKey: "fixture.services.minimal.missingDeliverable" },
    ],
  },
  {
    id: "fixture-full",
    slug: "fixture-full",
    category: "web-development",
    order: 1,
    titleKey: "fixture.services.full.title",
    descriptionKey: "fixture.services.full.description",
    overviewKey: "fixture.services.full.overview",
    audienceKey: "fixture.services.full.audience",
    challengesKey: "fixture.services.full.challenges",
    features: [
      {
        titleKey: "fixture.services.full.featureOne.title",
        descriptionKey: "fixture.services.full.featureOne.description",
      },
      { titleKey: "fixture.services.full.featureTwo.title" },
      // Empty title: must be dropped rather than rendered as a bare number.
      { titleKey: "fixture.services.full.missingFeature.title" },
    ],
    deliverables: [
      {
        titleKey: "fixture.services.full.deliverableOne.title",
        descriptionKey: "fixture.services.full.deliverableOne.description",
      },
      { titleKey: "fixture.services.full.deliverableTwo.title" },
    ],
    // Narrowed stages, and one id that no longer exists.
    processStepIds: ["discover", "retired-stage", "deliver"],
    // One id that no longer exists.
    faqIds: ["start-project", "retired-question", "project-cost"],
    price: 1200,
    currency: "USD",
  },
  {
    id: "fixture-sibling",
    slug: "fixture-sibling",
    category: "web-development",
    order: 2,
    titleKey: "fixture.services.sibling.title",
    descriptionKey: "fixture.services.sibling.description",
    // Explicit relationships win over the shared category; the unknown slug is
    // dropped instead of being turned into a broken card.
    relatedProjectSlugs: ["fixture-charlie", "retired-project"],
  },
];

export const FIXTURE_TRANSLATIONS = {
  en: {
    fixture: {
      services: {
        full: {
          title: "Full Fixture Service",
          description: "Fixture description for the full service.",
          overview: "Fixture overview copy.",
          audience: "Fixture audience copy.",
          challenges: "Fixture challenge copy.",
          featureOne: {
            title: "Fixture capability one",
            description: "Fixture capability one detail.",
          },
          featureTwo: { title: "Fixture capability two" },
          missingFeature: { title: "" },
          deliverableOne: {
            title: "Fixture deliverable one",
            description: "Fixture deliverable one detail.",
          },
          deliverableTwo: { title: "Fixture deliverable two" },
        },
        sibling: {
          title: "Sibling Fixture Service",
          description: "Fixture description for the sibling service.",
        },
        minimal: {
          title: "Minimal Fixture Service",
          description: "Fixture description for the minimal service.",
        },
      },
    },
  },
  ar: {
    fixture: {
      services: {
        full: {
          title: "خدمة نموذج كاملة",
          description: "وصف تجريبي للخدمة الكاملة.",
          overview: "نظرة عامة تجريبية.",
          audience: "جمهور تجريبي.",
          challenges: "تحدٍ تجريبي.",
          featureOne: { title: "قدرة تجريبية أولى", description: "تفصيل القدرة الأولى." },
          featureTwo: { title: "قدرة تجريبية ثانية" },
          missingFeature: { title: "" },
          deliverableOne: { title: "مخرج تجريبي أول", description: "تفصيل المخرج الأول." },
          deliverableTwo: { title: "مخرج تجريبي ثانٍ" },
        },
        sibling: {
          title: "خدمة نموذج مرافقة",
          description: "وصف تجريبي للخدمة المرافقة.",
        },
        minimal: {
          title: "خدمة نموذج مصغرة",
          description: "وصف تجريبي للخدمة المصغرة.",
        },
      },
    },
  },
};
