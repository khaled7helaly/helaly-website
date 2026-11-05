import { useTranslation } from "react-i18next";

import Checkbox from "../../../components/ui/Checkbox";
import addons from "../../../data/addons.json";
import services from "../../../data/services.json";
import isAddonCompatible from "../utils/isAddonCompatible";
import useRequestBuilder from "../hooks/useRequestBuilder";

/*
  Optional features are selectable but never priced: the charge for each one
  depends on the finished scope, so the list carries the custom-quote note
  instead of a figure. The selection itself travels with the request.
*/

function AddonSelector() {
  const { t } = useTranslation();
  const { state, dispatch } = useRequestBuilder();

  const selectedService =
    services.find((service) => service.id === state.selectedServiceId) ?? null;
  const categoryId =
    selectedService?.category ?? state.selectedCategoryId;

  // Only add-ons that fit the chosen service are offered, so nothing here can
  // be rejected by the reducer after the customer ticks it.
  const availableAddons = addons
    .filter((addon) =>
      isAddonCompatible(addon, state.selectedServiceId, categoryId),
    )
    .sort((first, second) => first.order - second.order);

  const selectedCount = availableAddons.filter((addon) =>
    state.selectedAddonIds.includes(addon.id),
  ).length;

  return (
    <section aria-label={t("request.wizard.addonsSectionTitle")} className="mt-2">
      <h3 className="text-xs font-semibold tracking-[0.16em] text-text-secondary uppercase rtl:normal-case rtl:tracking-normal">
        {t("request.wizard.addonsSectionTitle")}
      </h3>

      {availableAddons.length > 0 ? (
        <>
          <p
            aria-live="polite"
            className="mt-3 mb-4 text-sm text-text-secondary"
          >
            {t("request.addons.selectionSummary", {
              selected: selectedCount,
              total: availableAddons.length,
            })}
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {availableAddons.map((addon) => {
              const isSelected = state.selectedAddonIds.includes(addon.id);

              return (
                <li
                  key={addon.id}
                  className={`
                    rounded-xl border p-4 transition-colors duration-200
                    ${
                      isSelected
                        ? "border-brand bg-brand/10"
                        : "border-border bg-surface hover:border-brand/50"
                    }
                  `}
                >
                  <Checkbox
                    name="addons"
                    value={addon.id}
                    labelKey={addon.titleKey}
                    descriptionKey={addon.descriptionKey}
                    checked={isSelected}
                    onChange={() =>
                      dispatch({ type: "TOGGLE_ADDON", payload: addon.id })
                    }
                    className="min-w-0"
                  />
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {t("pricing.customQuote")}
          </p>
        </>
      ) : (
        <p className="mt-3 rounded-xl border border-border bg-surface p-4 text-sm text-text-secondary">
          {t("request.addons.noAvailable")}
        </p>
      )}
    </section>
  );
}

export default AddonSelector;
