import getRequestSelection from "./getRequestSelection";

/**
 * Builds the plain-text message handed to WhatsApp.
 *
 * Ordering follows the way the customer just answered the wizard — what they
 * are buying, then how they described it, then the optional commercial terms,
 * then how to reach them — so the business can read it top to bottom without
 * hunting. Labels are wrapped in WhatsApp's `*bold*` markup rather than
 * fighting for attention with caps alone, which keeps the message readable in
 * both the chat bubble and the notification preview.
 *
 * Everything it prints comes from the same resolver the review screen uses,
 * so the customer never sends something they did not just see.
 */
const text = (value) => String(value ?? "").trim();

function buildWhatsAppMessage({ state, t, language }) {
  const selection = getRequestSelection(state, { t, language });
  const {
    service,
    category,
    addons: selectedAddons,
    extraFields,
    projectType,
    projectTypeLabel,
    timeline,
    timelineLabel,
    budget,
  } = selection;

  const label = (labelKey) => `*${t(labelKey)}:*`;
  const description = text(state.projectDescription);
  const customer = state.customer ?? {};

  const lines = [
    t("request.whatsapp.message.introduction"),
    "",
    t("request.whatsapp.message.requestDetails"),
  ];

  if (category) {
    lines.push(`${label("request.orderSummary.category")} ${t(category.titleKey)}`);
  }

  if (service) {
    lines.push(`${label("request.orderSummary.service")} ${t(service.titleKey)}`);
  }

  if (projectType) {
    lines.push(
      `${label("request.orderSummary.projectType")} ${projectTypeLabel}`,
    );
  }

  if (description) {
    lines.push(
      `${label("request.orderSummary.projectDescription")}`,
      description,
    );
  }

  // The service's own questions come with their own labels, so a wedding date
  // or a product count reads correctly without this module knowing its name.
  extraFields.forEach((field) => {
    lines.push(`${label(field.labelKey)} ${field.value}`);
  });

  if (budget) {
    lines.push(`${label("request.orderSummary.yourBudget")} ${budget.formatted}`);
  }

  if (timeline) {
    lines.push(`${label("request.orderSummary.timeline")} ${timelineLabel}`);
  }

  if (selectedAddons.length > 0) {
    lines.push(
      `${label("request.orderSummary.addons")}`,
      ...selectedAddons.map((addon) => `- ${t(addon.titleKey)}`),
    );
  }

  lines.push(
    "",
    t("request.whatsapp.message.customerDetails"),
    `${label("request.orderSummary.customerName")} ${text(customer.fullName)}`,
    `${label("request.orderSummary.whatsapp")} ${text(customer.whatsapp)}`,
  );

  if (text(customer.email)) {
    lines.push(
      `${label("request.orderSummary.email")} ${text(customer.email)}`,
    );
  }

  lines.push("", t("request.whatsapp.message.closing"));

  return lines.join("\n");
}

export default buildWhatsAppMessage;
