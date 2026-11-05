import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

import SectionHeading from "../../../components/ui/SectionHeading";
import StartingPrice from "../../../components/ui/StartingPrice";
import { getHighlightDeliverables, packages } from "../utils/packageData";

/*
  Comparison laid out as self-labelled columns rather than a wide table.

  A four-column table cannot reflow without either horizontal scrolling or a
  misaligned header row, so each package carries its own row labels and the grid
  collapses 4 -> 2 -> 1 as the viewport narrows.
*/

const VISIBLE_DELIVERABLES = 4;

function ComparisonRow({ label, children }) {
  return (
    <div className="border-t border-border px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-text-primary">{children}</dd>
    </div>
  );
}

function ComparisonColumn({ record, headingLevel }) {
  const { t } = useTranslation();
  const Heading = `h${headingLevel}`;
  const highlights = getHighlightDeliverables(record);
  const visible = highlights.slice(0, VISIBLE_DELIVERABLES);
  const remaining = highlights.length - visible.length;
  const hasStartingPrice =
    record.startingPrice != null && Boolean(record.currency);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="bg-surface-raised px-5 py-4">
        <Heading className="text-base font-semibold text-text-primary">
          <Link
            to={`/packages/${record.slug}`}
            className="rounded-sm transition-colors hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {t(record.nameKey)}
          </Link>
        </Heading>

        {hasStartingPrice && (
          <StartingPrice
            amount={record.startingPrice}
            currency={record.currency}
            className="mt-1 text-sm"
          />
        )}
      </header>

      <dl className="flex flex-1 flex-col">
        <ComparisonRow label={t("packages.comparison.audience")}>
          {t(record.audienceLabelKey)}
        </ComparisonRow>

        <ComparisonRow label={t("packages.comparison.outcome")}>
          {t(record.promiseKey)}
        </ComparisonRow>

        <ComparisonRow label={t("packages.comparison.deliverables")}>
          <ul className="space-y-1">
            {visible.map((item) => (
              <li key={item.id} className="leading-relaxed">
                {t(item.titleKey)}
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <span className="mt-2 block text-text-secondary">
              {t("packages.comparison.moreDeliverables", { count: remaining })}
            </span>
          )}
        </ComparisonRow>

        <ComparisonRow label={t("packages.comparison.delivery")}>
          {t(record.deliveryKey)}
        </ComparisonRow>

        <ComparisonRow label={t("packages.comparison.revisions")}>
          {t("packages.card.revisionsValue", { count: record.revisions })}
        </ComparisonRow>

        <ComparisonRow label={t("packages.comparison.price")}>
          <StartingPrice
            amount={record.startingPrice}
            currency={record.currency}
            className="font-semibold"
          />
        </ComparisonRow>
      </dl>
    </article>
  );
}

function PackageComparison({ headingLevel = 2 }) {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeading
        eyebrow={t("packages.pageEyebrow")}
        title={t("packages.comparison.title")}
        description={t("packages.comparison.description")}
        className="mb-8"
      />

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((record) => (
          <li key={record.id} className="flex">
            <ComparisonColumn
              record={record}
              headingLevel={headingLevel + 1}
            />
          </li>
        ))}
      </ul>

      {/* Packages are personas, not tiers, so the biggest misreading to prevent
          is "the dearer one must include everything below it". */}
      <p className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-secondary">
        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-light" />
        {t("packages.comparison.note")}
      </p>
    </div>
  );
}

export default PackageComparison;
