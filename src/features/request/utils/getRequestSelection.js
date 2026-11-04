import addons from "../../../data/addons.json";
import categories from "../../../data/serviceCategories.json";
import requestOptions from "../../../data/requestOptions.json";
import services from "../../../data/services.json";

/**
 * Resolves the raw request state into the records and labels that both the
 * review screen and the WhatsApp message need.
 *
 * Before this helper existed the summary and the message each re-implemented
 * the same lookups, which meant they could silently disagree (for example
 * about which add-on was selected or how a custom timeline was labelled).
 * Keeping one resolver means the message is always an honest description of
 * what the customer just reviewed.
 *
 * `t` is injected so the helper stays usable from both React and plain JS,
 * and `language` drives number/currency formatting only.
 */
function getRequestSelection(state, { t, language = "en" } = {}) {
  const translate = typeof t === "function" ? t : (key) => key;
  const locale = language?.startsWith("ar") ? "ar-EG" : "en-US";

  const service =
    services.find((item) => item.id === state.selectedServiceId) ?? null;
  const categoryId = service?.category ?? state.selectedCategoryId;
  const category =
    categories.find((item) => item.id === categoryId) ?? null;

  const selectedAddons = state.selectedAddonIds
    .map((addonId) => addons.find((item) => item.id === addonId))
    .filter(Boolean);

  const projectType =
    requestOptions.projectTypes.find(
      (item) => item.value === state.selectedProjectType,
    ) ?? null;

  // Answers to the fields this service asked for, in the order the form showed
  // them, with blank ones dropped so nothing empty reaches the message.
  const extraFields = (service?.requestConfig?.extraFields ?? [])
    .map((field) => ({
      id: field.id,
      labelKey: field.labelKey,
      value: String(state.serviceFields?.[field.id] ?? "").trim(),
    }))
    .filter((field) => field.value.length > 0);

  const timeline =
    requestOptions.timelines.find(
      (item) => item.value === state.expectedTimeline,
    ) ?? null;

  // A custom timeframe only makes sense when its field was actually filled in;
  // otherwise the generic "Other" label is all we have.
  const timelineLabel = timeline
    ? timeline.value === "other"
      ? state.expectedTimelineOther.trim() || translate(timeline.labelKey)
      : translate(timeline.labelKey)
    : null;

  const currency =
    requestOptions.currencies.find(
      (item) => item.value === state.budgetCurrency,
    ) ?? null;

  const budgetAmount =
    String(state.budgetAmount ?? "").trim() === ""
      ? null
      : Number(state.budgetAmount);
  const budget =
    budgetAmount !== null &&
    Number.isFinite(budgetAmount) &&
    budgetAmount >= 0
      ? {
          amount: budgetAmount,
          currency: currency?.value ?? "",
          hasCurrency: Boolean(currency),
          // `code` keeps the amount unambiguous in a plain-text message.
          formatted: currency
            ? new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currency.value,
                currencyDisplay: "code",
              }).format(budgetAmount)
            : new Intl.NumberFormat(locale).format(budgetAmount),
        }
      : null;

  return {
    service,
    category,
    addons: selectedAddons,
    extraFields,
    projectType,
    projectTypeLabel: projectType ? translate(projectType.labelKey) : null,
    timeline,
    timelineLabel,
    currency,
    budget,
  };
}

export default getRequestSelection;
