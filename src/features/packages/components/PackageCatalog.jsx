import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Boxes, Layers } from "lucide-react";

import Button from "../../../components/ui/Button";
import { packages } from "../utils/packageData";
import PackageCard from "./PackageCard";

/*
  The catalogue grid plus the "which path am I on?" explanation.

  Packages and custom services stay two separate destinations: this block links
  out to the services path instead of trying to funnel a fixed package through
  the custom request wizard.
*/

function CatalogChoice() {
  const { t } = useTranslation();

  return (
    <div className="mb-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-heading-md font-semibold text-text-primary">
        {t("packages.catalog.chooseTitle")}
      </h2>

      <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-text-secondary">
        {t("packages.catalog.chooseBody")}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button as={Link} to="/services" variant="outline" size="sm">
          <Layers size={16} aria-hidden="true" />
          {t("packages.catalog.chooseServices")}
        </Button>

        <span className="inline-flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-text-primary">
          <Boxes size={16} aria-hidden="true" className="text-brand-light" />
          {t("packages.catalog.choosePackages")}
        </span>
      </div>
    </div>
  );
}

function PackageCatalog({ headingLevel = 2 }) {
  const { t } = useTranslation();

  return (
    <div>
      <CatalogChoice />

      <p className="mb-6 text-sm text-text-secondary" aria-live="polite">
        {t("packages.catalog.count", { count: packages.length })}
      </p>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((record) => (
          <li key={record.id} className="flex">
            <PackageCard record={record} headingLevel={headingLevel} />
          </li>
        ))}
      </ul>

      <p className="mt-8 flex items-center gap-2 text-sm text-text-secondary">
        <ArrowRight size={16} aria-hidden="true" className="rtl:rotate-180" />
        {t("packages.comparison.note")}
      </p>
    </div>
  );
}

export default PackageCatalog;
