import categoriesData from "../../../data/serviceCategories.json";
import servicesData from "../../../data/services.json";

// The JSON is static, so ordering and counting happen once at module load
// instead of on every render. The category nav and the grid also share one
// source of truth for ordering, so they can never disagree.

export const categories = [...categoriesData].sort(
  (first, second) => first.order - second.order,
);

const categoryRank = new Map(
  categories.map((category, index) => [category.slug, index]),
);

export const services = [...servicesData].sort((first, second) => {
  const rankDifference =
    (categoryRank.get(first.category) ?? Infinity) -
    (categoryRank.get(second.category) ?? Infinity);

  return rankDifference || first.order - second.order;
});

export const countByCategory = services.reduce((counts, { category }) => {
  counts[category] = (counts[category] ?? 0) + 1;
  return counts;
}, {});

// The handful of services the home page hero is allowed to show. Membership is
// opted into in `services.json` via `heroFeatured`, and `featuredOrder` decides
// the sequence, so the home page never has to know which services these are.
export const heroFeaturedServices = [...servicesData]
  .filter((service) => service.heroFeatured)
  .sort(
    (first, second) =>
      (first.featuredOrder ?? Infinity) - (second.featuredOrder ?? Infinity),
  );
