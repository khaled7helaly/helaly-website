import { useTranslation } from "react-i18next";
import { AlertTriangle, Check } from "lucide-react";

import { getHighlightDeliverables } from "../utils/packageData";
import { getPackageTermsSections } from "../utils/packageContent";
import describeAddonPrice from "../utils/describeAddonPrice";
import formatMoney from "../utils/formatMoney";

/*
  The package detail body is laid out as a commercial proposal document rather
  than a marketing page: a titled paper surface, a reference line, then numbered
  clauses. Every value comes from `packages.json`; nothing is restated here.

  `proposal.scope` lists the whole scope compactly, while `proposal.deliverables`
  expands the key items with the detail the catalogue supplies for them.
*/

function Section({ number, title, children, tone = "default" }) {
  return (
    <section className="border-t border-border px-6 py-6 sm:px-8">
      <h2 className="flex items-baseline gap-3 text-base font-semibold text-text-primary">
        <span className="text-sm tabular-nums text-brand-light">{number}</span>
        {title}
      </h2>

      <div
        className={
          tone === "muted"
            ? "mt-3 text-sm leading-relaxed text-text-secondary"
            : "mt-3 text-sm leading-relaxed text-text-primary"
        }
      >
        {children}
      </div>
    </section>
  );
}

function PackageProposalDocument({ record }) {
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage;
  const highlights = getHighlightDeliverables(record);
  const terms = getPackageTermsSections();
  const price = formatMoney(record.price, record.currency, language);
  const reference = `PKG-${String(record.order).padStart(2, "0")}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-raised px-6 py-5 sm:px-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {t("packages.proposal.documentLabel")}
          </span>
          <p className="mt-1 text-lg font-semibold text-text-primary">
            {t(record.nameKey)}
          </p>
        </div>

        <div className="text-end text-sm text-text-secondary">
          <span className="block text-xs uppercase tracking-wide">
            {t("packages.proposal.reference")}
          </span>
          <span className="font-semibold tabular-nums text-text-primary">
            {reference}
          </span>
        </div>
      </header>

      <Section number="01" title={t("packages.proposal.audience")}>
        <ul className="flex flex-wrap gap-2">
          {record.audience.map((item) => (
            <li
              key={item.id}
              className="rounded-full border border-border bg-surface-raised px-3 py-1 text-xs text-text-primary"
            >
              {t(item.labelKey)}
            </li>
          ))}
        </ul>
      </Section>

      <Section number="02" title={t("packages.proposal.intro")} tone="muted">
        {t(record.introKey)}
      </Section>

      <Section number="03" title={t("packages.proposal.scope")}>
        <ul className="space-y-2">
          {record.deliverables.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <Check
                size={16}
                aria-hidden="true"
                className="mt-1 shrink-0 text-brand-light"
              />
              <span>{t(item.titleKey)}</span>
            </li>
          ))}
        </ul>
      </Section>

      {highlights.length > 0 && (
        <Section number="04" title={t("packages.proposal.deliverables")}>
          <ul className="space-y-4">
            {highlights.map((item) => (
              <li key={item.id}>
                <p className="font-medium text-text-primary">
                  {t(item.titleKey)}
                </p>
                {item.detailKey && (
                  <p className="mt-1 text-text-secondary">
                    {t(item.detailKey)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section number="05" title={t("packages.proposal.delivery")}>
        <p>{t(record.deliveryKey)}</p>
        <p className="mt-2 text-text-secondary">
          {t("packages.details.startDelivery")}
        </p>
      </Section>

      <Section number="06" title={t("packages.proposal.revisions")} tone="muted">
        {t("packages.details.revisionsValue")}
      </Section>

      <Section number="07" title={t("packages.proposal.requirements")}>
        <ul className="space-y-2">
          {record.requirements.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-light"
              />
              <span>{t(item.labelKey)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section number="08" title={t("packages.proposal.addons")}>
        <ul className="space-y-3">
          {record.addons.map((addon) => (
            <li key={addon.id}>
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-text-primary">
                  {t(addon.titleKey)}
                </span>
                <span className="text-sm tabular-nums text-text-secondary">
                  {describeAddonPrice(addon, t, language)}
                </span>
              </p>
              {addon.noteKey && (
                <p className="mt-1 text-text-secondary">{t(addon.noteKey)}</p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {record.notes.length > 0 && (
        <Section number="09" title={t("packages.proposal.notes")}>
          <ul className="space-y-3">
            {record.notes.map((note) => (
              <li
                key={note.id}
                className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-text-primary"
              >
                <AlertTriangle
                  size={16}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-warning"
                />
                <span>{t(note.labelKey)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section number="10" title={t("packages.proposal.terms")}>
        <ul className="space-y-4">
          {terms.map((term) => (
            <li key={term.id}>
              <p className="font-medium text-text-primary">
                {t(term.titleKey)}
              </p>
              <p className="mt-1 whitespace-pre-line text-text-secondary">
                {t(term.bodyKey)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section number="11" title={t("packages.proposal.price")}>
        <span className="text-2xl font-bold tabular-nums text-text-primary">
          {price}
        </span>
      </Section>
    </article>
  );
}

export default PackageProposalDocument;
