import { useTranslation } from "react-i18next";

import SectionHeading from "../../../components/ui/SectionHeading";
import { getPackageTermsSections } from "../utils/packageContent";

/*
  The commercial terms that apply to every package order. Bodies keep their
  line breaks (`whitespace-pre-line`) because each clause is written as a short
  list the customer can scan.
*/

function PackageTerms() {
  const { t } = useTranslation();
  const sections = getPackageTermsSections();

  return (
    <section>
      <SectionHeading
        eyebrow={t("packages.pageEyebrow")}
        title={t("packages.terms.title")}
        description={t("packages.terms.description")}
        className="mb-6"
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <li
            key={section.id}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <h3 className="text-base font-semibold text-text-primary">
              {t(section.titleKey)}
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
              {t(section.bodyKey)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PackageTerms;
