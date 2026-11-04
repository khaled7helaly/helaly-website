import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import EmptyState from "../../../components/ui/EmptyState";
import { services } from "../utils/serviceData";
import filterServices from "../utils/filterServices";
import ServiceCard from "./ServiceCard";

function ServiceGrid({
  limit,
  featuredOnly = false,
  category,
  query = "",
  priorityCount = 0,
  headingLevel = 3,
  className = "",
}) {
  const { t, i18n } = useTranslation();

  // `services` is already sorted once at module load; here we only filter.
  const visibleServices = useMemo(() => {
    let list = services;

    if (featuredOnly) list = list.filter((service) => service.featured);
    if (category) {
      list = list.filter((service) => service.category === category);
    }

    list = filterServices(list, {
      query,
      t,
      language: i18n.resolvedLanguage,
    });

    if (Number.isFinite(limit) && limit >= 0) list = list.slice(0, limit);

    return list;
  }, [featuredOnly, category, query, limit, t, i18n.resolvedLanguage]);

  if (visibleServices.length === 0) {
    // A search that matched nothing needs different wording from a category
    // that simply has no services in it yet.
    const isSearchEmpty = query.trim().length > 0;

    return (
      <EmptyState
        titleKey={
          isSearchEmpty ? "services.search.noResultsTitle" : "services.empty.title"
        }
        descriptionKey={
          isSearchEmpty
            ? "services.search.noResultsBody"
            : "services.empty.description"
        }
        className={className}
      />
    );
  }

  return (
    <ul className={`grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6 ${className}`}>
      {visibleServices.map((service, index) => (
        <li key={service.id} className="flex">
          <ServiceCard
            service={service}
            // Only the first row is above the fold, so only it loads eagerly.
            priority={index < priorityCount}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}

export default ServiceGrid;
