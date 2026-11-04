import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Boxes } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import ServiceCategories from "../features/services/components/ServiceCategories";
import ServiceGrid from "../features/services/components/ServiceGrid";
import ServiceSearch from "../features/services/components/ServiceSearch";
import ServicesHero from "../features/services/components/ServicesHero";
import filterServices from "../features/services/utils/filterServices";
import { services } from "../features/services/utils/serviceData";

/*
  Path A — custom services.

  Search and the category filter both live in the URL, so a filtered view is
  shareable and the browser's back button behaves. The toolbar reads one source
  of truth (`filterServices`), which is the same function the grid uses, so the
  count above the results can never disagree with what is rendered.
*/

function PackagesCrossLink() {
  const { t } = useTranslation();

  return (
    <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h2 className="text-heading-md font-semibold text-text-primary">
          {t("packages.catalog.chooseTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-text-secondary">
          {t("packages.catalog.chooseBody")}
        </p>
      </div>

      <Button as={Link} to="/packages" variant="outline" className="shrink-0">
        <Boxes size={18} aria-hidden="true" />
        {t("packages.catalog.choosePackages")}
      </Button>
    </div>
  );
}

function ServicesPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const query = searchParams.get("q") ?? "";

  const updateQuery = (next) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);

        if (next.trim()) {
          params.set("q", next);
        } else {
          params.delete("q");
        }

        return params;
      },
      // Typing must not reset the page scroll or push a history entry per key.
      { replace: true, preventScrollReset: true },
    );
  };

  const resultCount = useMemo(() => {
    const scoped = category
      ? services.filter((service) => service.category === category)
      : services;

    return filterServices(scoped, {
      query,
      t,
      language: i18n.resolvedLanguage,
    }).length;
  }, [category, query, t, i18n.resolvedLanguage]);

  return (
    <>
      {/* The hero carries the page h1, so the toolbar below needs no heading. */}
      <ServicesHero />

      <section className="py-12 sm:py-14 lg:py-16">
        <Container>
          <ServiceSearch
            value={query}
            onChange={updateQuery}
            resultCount={resultCount}
            className="mb-6 max-w-xl"
          />

          <ServiceCategories
            activeCategory={category}
            query={query}
            className="mb-8"
          />

          {/* h1 is in the hero, so cards use h2 here; the first row loads its images eagerly. */}
          <ServiceGrid
            category={category}
            query={query}
            priorityCount={2}
            headingLevel={2}
          />

          <PackagesCrossLink />
        </Container>
      </section>
    </>
  );
}

export default ServicesPage;
