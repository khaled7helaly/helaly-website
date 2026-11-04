import formatMoney from "./formatMoney";
import { resolveFieldOptions } from "./packageData";

/**
 * Builds the plain-text WhatsApp message for a fixed-package inquiry.
 *
 * It reports three separate money figures rather than one invented total: the
 * base price, the known fixed add-ons, and — explicitly labelled — anything
 * whose real cost still has to be confirmed. A customer reading the message in
 * the chat bubble sees exactly what the price summary showed them on the page.
 *
 * @typedef {import("./packageData").PackageRecord} PackageRecord
 * @typedef {import("./calculatePackagePrice").PackagePriceBreakdown} PackagePriceBreakdown
 * @typedef {import("./validatePackageInquiry").PackageInquiryState} PackageInquiryState
 *
 * @param {object} params
 * @param {PackageRecord} params.record
 * @param {PackageInquiryState} params.state
 * @param {PackagePriceBreakdown} params.price
 * @param {(key: string, options?: object) => string} params.t
 * @param {Record<string, { value: string, labelKey: string }[]>} params.optionGroups
 * @param {string} [params.language]
 * @returns {string}
 */
export default function buildPackageWhatsAppMessage({
  record,
  state,
  price,
  t,
  optionGroups,
  language = "en",
}) {
  const text = (value) => String(value ?? "").trim();
  const label = (key) => `*${t(key)}:*`;
  const money = (amount, currency) => formatMoney(amount, currency, language);

  const lines = [
    t("packages.whatsapp.introduction"),
    "",
    t("packages.whatsapp.packageSection"),
    `${label("packages.summary.packageName")} ${t(record.nameKey)}`,
  ];

  if (price) {
    lines.push(
      `${label("packages.summary.basePrice")} ${money(price.base, price.currency)}`,
    );
  }

  if (price && price.fixedAddons.length > 0) {
    lines.push(
      label("packages.summary.fixedAddons"),
      ...price.fixedAddons.map(
        (addon) =>
          `- ${t(addon.titleKey)} — ${money(addon.amount, addon.currency)}`,
      ),
      `${label("packages.summary.subtotal")} ${money(price.subtotal, price.currency)}`,
    );
  } else if (price) {
    lines.push(
      `${label("packages.summary.subtotal")} ${money(price.subtotal, price.currency)}`,
    );
  }

  if (price && price.variableAddons.length > 0) {
    lines.push(
      label("packages.summary.variableAddons"),
      ...price.variableAddons.map((addon) => {
        const base = `- ${t(addon.titleKey)}`;

        if (addon.kind === "from" && addon.amount != null) {
          return `${base} — ${t("packages.summary.startingFrom")} ${money(addon.amount, addon.currency)}`;
        }

        return `${base} — ${t("packages.summary.atCost")}`;
      }),
    );
  }

  const answeredFields = (record.fields ?? [])
    .map((field) => {
      const raw = text(state.answers?.[field.id]);
      if (!raw) return null;

      if (field.type === "select") {
        const option = resolveFieldOptions(field, optionGroups).find(
          (item) => item.value === raw,
        );
        return `- ${t(field.labelKey)}: ${option ? t(option.labelKey) : raw}`;
      }

      return `- ${t(field.labelKey)}: ${raw}`;
    })
    .filter(Boolean);

  if (answeredFields.length > 0) {
    lines.push(
      "",
      t("packages.whatsapp.detailsSection"),
      ...answeredFields,
    );
  }

  const notes = text(state.notes);
  if (notes) {
    lines.push("", `${label("packages.summary.notes")}`, notes);
  }

  lines.push(
    "",
    t("packages.whatsapp.contactSection"),
    `${label("packages.summary.customerName")} ${text(state.fullName)}`,
    `${label("packages.summary.whatsapp")} ${text(state.whatsapp)}`,
    "",
    t("packages.whatsapp.closing"),
  );

  return lines.join("\n");
}
