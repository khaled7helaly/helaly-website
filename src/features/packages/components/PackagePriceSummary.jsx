import { useTranslation } from "react-i18next";

import StartingPrice from "../../../components/ui/StartingPrice";

/*
  Summary shown beside the order form.

  It states the package's starting price and nothing more: the optional add-ons
  are never priced individually and nothing is added up, because the real
  quotation is prepared after the customer's requirements are reviewed.
*/

function PackagePriceSummary({ record }) {
  const { t } = useTranslation();

  const hasStartingPrice =
    record.startingPrice != null && Boolean(record.currency);

  return (
    <section
      aria-labelledby="package-summary-title"
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      <h3
        id="package-summary-title"
        className="text-base font-semibold text-text-primary"
      >
        {t("packages.summary.title")}
      </h3>

      <p className="mt-4 text-sm text-text-secondary">
        {t("packages.summary.packageName")}
      </p>
      <p className="mt-1 text-sm font-medium text-text-primary">
        {t(record.nameKey)}
      </p>

      {hasStartingPrice && (
        <StartingPrice
          amount={record.startingPrice}
          currency={record.currency}
          className="mt-4 text-lg"
        />
      )}

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {t("pricing.customQuote")}
      </p>
    </section>
  );
}

export default PackagePriceSummary;
