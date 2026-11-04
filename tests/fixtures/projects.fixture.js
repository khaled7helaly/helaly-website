/**
 * TEMPORARY TEST FIXTURES — never imported by application code.
 *
 * `src/data/projects.json` stays empty until real project data exists. These
 * objects only exercise the case-study page and its components, and their
 * translations are fed to i18next at runtime from this file so no sample copy
 * ever lands in `src/i18n/locales/*.json`.
 *
 * The array order is deliberately different from `order` so the order-driven
 * prev/next logic is actually covered.
 */
export const PROJECT_FIXTURES = [
  {
    slug: "fixture-charlie",
    order: 3,
    titleKey: "fixture.projects.charlie.title",
    descriptionKey: "fixture.projects.charlie.description",
    thumbnail: "/fixtures/charlie-cover.webp",
    gallery: [
      { src: "/fixtures/charlie-detail.webp", altKey: "fixture.projects.charlie.galleryAlt" },
    ],
    // Must never reach an href.
    demoUrl: "javascript:alert('unsafe')",
  },
  {
    slug: "fixture-alpha",
    order: 1,
    titleKey: "fixture.projects.alpha.title",
    descriptionKey: "fixture.projects.alpha.description",
    category: "web-development",
    overviewKey: "fixture.projects.alpha.overview",
    challengeKey: "fixture.projects.alpha.challenge",
    solutionKey: "fixture.projects.alpha.solution",
    features: [
      {
        titleKey: "fixture.projects.alpha.featureOne.title",
        descriptionKey: "fixture.projects.alpha.featureOne.description",
      },
      { titleKey: "fixture.projects.alpha.featureTwo.title" },
      { titleKey: "fixture.projects.alpha.missingFeature.title" },
    ],
    technologies: ["React", "Vite", "Tailwind CSS"],
    thumbnail: "/fixtures/alpha-cover.webp",
    gallery: [
      { src: "/fixtures/alpha-1.webp", width: 1600, height: 900 },
      { src: "/fixtures/alpha-2.webp", width: 1200, height: 1500 },
      { src: "/fixtures/alpha-3.webp" },
    ],
    demoUrl: "https://example.com/preview",
    repositoryUrl: "https://example.com/repository",
    featured: true,
  },
  {
    slug: "fixture-bravo",
    order: 2,
    titleKey: "fixture.projects.bravo.title",
    descriptionKey: "fixture.projects.bravo.description",
  },
];

export const FIXTURE_TRANSLATIONS = {
  en: {
    fixture: {
      projects: {
        alpha: {
          title: "Alpha Fixture",
          description: "Fixture summary for the alpha project.",
          overview: "Fixture overview copy.",
          challenge: "Fixture challenge copy.",
          solution: "Fixture solution copy.",
          featureOne: {
            title: "Fixture feature one",
            description: "Fixture feature one description.",
          },
          featureTwo: { title: "Fixture feature two" },
          missingFeature: { title: "" },
        },
        bravo: {
          title: "Bravo Fixture",
          description: "Fixture summary for the bravo project.",
        },
        charlie: {
          title: "Charlie Fixture",
          description: "Fixture summary for the charlie project.",
          galleryAlt: "Fixture charlie detail",
        },
      },
    },
  },
  ar: {
    fixture: {
      projects: {
        alpha: {
          title: "نموذج ألفا",
          description: "وصف تجريبي لمشروع ألفا.",
          overview: "نظرة عامة تجريبية.",
          challenge: "تحدٍ تجريبي.",
          solution: "حل تجريبي.",
          featureOne: { title: "ميزة تجريبية أولى", description: "تفصيل الميزة الأولى." },
          featureTwo: { title: "ميزة تجريبية ثانية" },
          missingFeature: { title: "" },
        },
        bravo: { title: "نموذج برافو", description: "وصف تجريبي لمشروع برافو." },
        charlie: {
          title: "نموذج تشارلي",
          description: "وصف تجريبي لمشروع تشارلي.",
          galleryAlt: "تفصيل تجريبي",
        },
      },
    },
  },
};
