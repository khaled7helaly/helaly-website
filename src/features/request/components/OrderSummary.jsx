import { useTranslation } from "react-i18next";

import getRequestSelection from "../utils/getRequestSelection";
import useRequestBuilder from "../hooks/useRequestBuilder";

function SummaryRow({ label, children }) {
  return (
    <div className="grid gap-1 py-1.5 sm:grid-cols-[minmax(8rem,0.6fr)_minmax(0,1.4fr)] sm:gap-4">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="min-w-0 text-sm font-medium text-text-primary">
        {children}
      </dd>
    </div>
  );
}

/**
 * The review screen is the last chance to catch a mistake, so every group of
 * answers carries its own "Edit" jump. Previously the only way back was the
 * progress bar, whose labels are hidden on mobile.
 *
 * No service or add-on price is printed here. The selection is what is being
 * reviewed, and the quotation is prepared after the scope is read — so the only
 * money on screen is the budget the customer typed themselves.
 */
function SummarySection({ titleKey, step, onEdit, children }) {
  const { t } = useTranslation();

  return (
    <section className="border-b border-border/70 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <h4 className="text-xs font-semibold tracking-[0.16em] text-text-secondary uppercase rtl:tracking-normal rtl:normal-case">
          {t(titleKey)}
        </h4>

        {onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="shrink-0 rounded-md text-xs font-semibold text-brand-light underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-current focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            {t("request.orderSummary.edit")}
          </button>
        ) : null}
      </div>

      <dl className="grid">{children}</dl>
    </section>
  );
}

function OrderSummary({ onEditStep }) {
  const { t, i18n } = useTranslation();
  const { state } = useRequestBuilder();

  const selection = getRequestSelection(state, {
    t,
    language: i18n.resolvedLanguage,
  });
  const {
    service,
    category,
    addons: selectedAddons,
    extraFields,
    budget,
  } = selection;

  const description = state.projectDescription.trim();
  const { fullName, whatsapp, email } = state.customer;
  const hasContact = Boolean(fullName.trim() || whatsapp.trim() || email.trim());
  // Service, project and extras all live in step 1; budget and timeline in
  // step 2; contact in step 3 — the same numbering the progress bar shows.
  const hasProject =
    Boolean(selection.projectType) || Boolean(description) || extraFields.length > 0;
  const hasBudget = Boolean(budget || selection.timelineLabel);

  return (
    <section
      aria-labelledby="request-order-summary-title"
      className="rounded-2xl border border-border bg-surface p-5 sm:p-7"
    >
      <h3
        id="request-order-summary-title"
        className="mb-4 text-base font-semibold text-text-primary"
      >
        {t("request.orderSummary.title")}
      </h3>

      <SummarySection
        titleKey="request.orderSummary.sections.service"
        step={1}
        onEdit={onEditStep}
      >
        <SummaryRow label={t("request.orderSummary.category")}>
          {category ? (
            t(category.titleKey)
          ) : (
            <span className="font-normal text-text-secondary">
              {t("request.orderSummary.notSelected")}
            </span>
          )}
        </SummaryRow>

        <SummaryRow label={t("request.orderSummary.service")}>
          {service ? (
            t(service.titleKey)
          ) : (
            <span className="font-normal text-text-secondary">
              {t("request.orderSummary.selectService")}
            </span>
          )}
        </SummaryRow>
      </SummarySection>

      {hasProject ? (
        <SummarySection
          titleKey="request.orderSummary.sections.project"
          step={2}
          onEdit={onEditStep}
        >
          {selection.projectType ? (
            <SummaryRow label={t("request.orderSummary.projectType")}>
              {selection.projectTypeLabel}
            </SummaryRow>
          ) : null}

          {description ? (
            <SummaryRow label={t("request.orderSummary.projectDescription")}>
              <p className="font-normal whitespace-pre-wrap">{description}</p>
            </SummaryRow>
          ) : null}

          {extraFields.map((field) => (
            <SummaryRow key={field.id} label={t(field.labelKey)}>
              <span className="font-normal">{field.value}</span>
            </SummaryRow>
          ))}
        </SummarySection>
      ) : null}

      {hasBudget ? (
        <SummarySection
          titleKey="request.orderSummary.sections.budget"
          step={2}
          onEdit={onEditStep}
        >
          {budget ? (
            <SummaryRow label={t("request.orderSummary.yourBudget")}>
              <bdi>{budget.formatted}</bdi>
            </SummaryRow>
          ) : null}

          {selection.timelineLabel ? (
            <SummaryRow label={t("request.orderSummary.timeline")}>
              {selection.timelineLabel}
            </SummaryRow>
          ) : null}
        </SummarySection>
      ) : null}

      <SummarySection
        titleKey="request.orderSummary.sections.addons"
        step={1}
        onEdit={onEditStep}
      >
        <SummaryRow label={t("request.orderSummary.addons")}>
          {selectedAddons.length > 0 ? (
            <ul className="space-y-1.5">
              {selectedAddons.map((addon) => (
                <li key={addon.id}>{t(addon.titleKey)}</li>
              ))}
            </ul>
          ) : (
            <span className="font-normal text-text-secondary">
              {t("request.orderSummary.noAddons")}
            </span>
          )}
        </SummaryRow>
      </SummarySection>

      {hasContact ? (
        <SummarySection
          titleKey="request.orderSummary.sections.contact"
          step={3}
          onEdit={onEditStep}
        >
          {fullName.trim() ? (
            <SummaryRow label={t("request.orderSummary.customerName")}>
              {fullName}
            </SummaryRow>
          ) : null}

          {whatsapp.trim() ? (
            <SummaryRow label={t("request.orderSummary.whatsapp")}>
              <bdi>{whatsapp}</bdi>
            </SummaryRow>
          ) : null}

          {email.trim() ? (
            <SummaryRow label={t("request.orderSummary.email")}>
              <bdi>{email}</bdi>
            </SummaryRow>
          ) : null}
        </SummarySection>
      ) : null}

      {service ? (
        <p
          role="status"
          className="mt-5 rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-text-secondary"
        >
          {t("pricing.customQuote")}
        </p>
      ) : null}
    </section>
  );
}

export default OrderSummary;
