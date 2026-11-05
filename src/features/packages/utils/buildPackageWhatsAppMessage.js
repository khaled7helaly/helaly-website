import formatStartingPrice from "../../../lib/formatStartingPrice";
import { resolveFieldOptions } from "./packageData";

/**
 * Builds the plain-text WhatsApp message for a package inquiry.
 *
 * It hands over the selected package, the optional features the customer ticked
 * and the answers they filled in — but no computed price, because the quotation
 * is only prepared once the scope is reviewed. The single money figure it states
 * is the package's published starting price, always worded as a starting point.
 *
 * @typedef {import("./packageData").PackageRecord} PackageRecord
 * @typedef {import("./validatePackageInquiry").PackageInquiryState} PackageInquiryState
 *
 * @param {object} params
 * @param {PackageRecord} params.record
 * @param {PackageInquiryState} params.state
 * @param {string[]} [params.selectedAddonIds]
 * @param {(key: string, options?: object) => string} params.t
 * @param {Record<string, { value: string, labelKey: string }[]>} params.optionGroups
 * @param {string} [params.language]
 * @returns {string}
 */
export default function buildPackageWhatsAppMessage({
  record,
  state,
  selectedAddonIds = [],
  t,
  optionGroups,
  language = "en",
}) {
  const text = (value) => String(value ?? "").trim();
  const label = (key) => `*${t(key)}:*`;

  const selectedIdSet = new Set(
    Array.isArray(selectedAddonIds) ? selectedAddonIds : [],
  );
  const selectedAddons = (record.addons ?? []).filter((addon) =>
    selectedIdSet.has(addon.id),
  );

  const hasStartingPrice =
    record.startingPrice != null && Boolean(record.currency);
  const startingPrice = hasStartingPrice
    ? formatStartingPrice(record.startingPrice, record.currency, language, t)
    : "";

  const lines = [
    t("packages.whatsapp.introduction"),
    "",
    t("packages.whatsapp.packageSection"),
    `${label("packages.summary.packageName")} ${t(record.nameKey)}`,
  ];

  if (startingPrice) {
    lines.push(`${label("pricing.startingFrom")} ${startingPrice}`);
  }

  if (selectedAddons.length > 0) {
    lines.push(
      "",
      label("packages.addonPanel.title"),
      ...selectedAddons.map((addon) => `- ${t(addon.titleKey)}`),
    );
  }

  lines.push("", t("pricing.customQuote"));

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
