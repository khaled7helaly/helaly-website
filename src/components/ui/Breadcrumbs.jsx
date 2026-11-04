import { Link, useMatches } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

import Container from "./Container";
import packages from "../../data/packages.json";
import projects from "../../data/projects.json";
import services from "../../data/services.json";

// Resource breadcrumbs read the record's own name key off the same data source
// the page uses, so the crumb and the page title can never disagree.
const RESOURCE_SOURCES = {
  service: { records: services, nameKey: "titleKey" },
  project: { records: projects, nameKey: "titleKey" },
  package: { records: packages, nameKey: "nameKey" },
};

function Breadcrumbs() {
  const { t } = useTranslation();
  const matches = useMatches();
  const items = [];

  for (const match of matches) {
    const breadcrumb = match.handle?.breadcrumb;

    if (!breadcrumb) {
      continue;
    }

    if (breadcrumb.parents) {
      items.push(...breadcrumb.parents);
    }

    if (breadcrumb.resource) {
      const source = RESOURCE_SOURCES[breadcrumb.resource];
      const record = source?.records.find(
        (item) => item.slug === match.params.slug,
      );

      if (!record) {
        return null;
      }

      items.push({ labelKey: record[source.nameKey] });
      continue;
    }

    items.push(breadcrumb);
  }

  const uniqueItems = items.filter((item, index, list) => {
    const identity = item.to || item.labelKey;

    return list.findIndex(
      (candidate) => (candidate.to || candidate.labelKey) === identity,
    ) === index;
  });

  if (uniqueItems.length === 0) {
    return null;
  }

  return (
    <Container as="nav" aria-label={t("common.breadcrumbNavigation")} className="py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {uniqueItems.map((item, index) => {
          const isCurrent = index === uniqueItems.length - 1;
          const label = item.labelKey ? t(item.labelKey) : item.label;

          return (
            <li
              key={item.to || item.labelKey || label}
              className="flex items-center gap-2"
            >
              {item.to && !isCurrent ? (
                <Link
                  to={item.to}
                  className="rounded-sm text-start text-text-secondary transition-colors hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "text-start font-medium text-text-primary"
                      : "text-start text-text-secondary"
                  }
                >
                  {label}
                </span>
              )}

              {!isCurrent && (
                <ChevronRight
                  size={14}
                  className="shrink-0 text-text-secondary rtl:rotate-180"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </Container>
  );
}

export default Breadcrumbs;