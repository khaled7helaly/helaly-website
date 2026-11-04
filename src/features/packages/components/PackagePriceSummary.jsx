import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

import formatMoney from "../utils/formatMoney";

/*
  Live price summary for the order section.

  It deliberately prints three separate things — the fixed base, the fixed-price
  add-ons and the resulting known subtotal — and lists anything whose real cost
  is not yet known as its own labelled line. No uncertain amount is ever folded
  into the subtotal, because that would print a total the catalogue cannot back.
*/

function Row({ label, value, emphasis = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt
        className={
          emphasis
            ? "text-sm font-semibold text-text-primary"
            : "text-sm text-text-secondary"
        }
      >
        {label}
      </dt>
      <dd
        className={`shrink-0 tabular-nums ${
          emphasis
            ? "text-base font-bold text-text-primary"
            : "text-sm text-text-primary"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function PackagePriceSummary({ record, price }) {
  const { t, i18n } = useTranslation();

  // A malformed base price hides every money surface rather than inventing one.
  if (!price) return null;

  const language = i18n.resolvedLanguage;
  const money = (amount, currency) => formatMoney(amount, currency, language);

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

      <dl className="mt-4">
        <Row label={t("packages.summary.packageName")} value={t(record.nameKey)} />
        <Row
          label={t("packages.summary.basePrice")}
          value={money(price.base, price.currency)}
        />

        {price.fixedAddons.length > 0 && (
          <>
            <div className="mt-2 border-t border-border pt-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {t("packages.summary.fixedAddons")}
              </span>
            </div>

            {price.fixedAddons.map((addon) => (
              <Row
                key={addon.id}
                label={t(addon.titleKey)}
                value={money(addon.amount, addon.currency)}
              />
            ))}
          </>
        )}

        <div className="mt-2 border-t border-border pt-3">
          <Row
            label={t("packages.summary.subtotal")}
            value={money(price.subtotal, price.currency)}
            emphasis
          />
        </div>
      </dl>

      {price.variableAddons.length > 0 && (
        <div className="mt-5 rounded-xl border border-border bg-surface-raised p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {t("packages.summary.variableAddons")}
          </span>

          <ul className="mt-3 space-y-2">
            {price.variableAddons.map((addon) => (
              <li
                key={addon.id}
                className="flex items-baseline justify-between gap-4 text-sm"
              >
                <span className="text-text-primary">{t(addon.titleKey)}</span>
                <span className="shrink-0 tabular-nums text-text-secondary">
                  {addon.kind === "from" && addon.amount != null
                    ? `${t("packages.summary.startingFrom")} ${money(addon.amount, addon.currency)}`
                    : t("packages.summary.atCost")}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-text-secondary">
            <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-light" />
            {t("packages.summary.variableNotice")}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-text-secondary">
        {t("packages.summary.disclaimer")}
      </p>
    </section>
  );
}

export default PackagePriceSummary;
