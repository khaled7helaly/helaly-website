import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import categories from "../../../data/serviceCategories.json";
import services from "../../../data/services.json";
import getDisplayErrors from "../utils/getDisplayErrors";
import useRequestBuilder from "../hooks/useRequestBuilder";

/**
 * Step 1 used to be two dependent dropdowns: the service list stayed disabled
 * until a category was chosen, and once it opened the catalog was invisible.
 * Picking a card is now a single decision — the reducer derives the category
 * from the service — so a slug arriving from the URL is visible and changeable
 * straight away.
 *
 * The radios are real inputs grouped under a fieldset per category, which
 * gives native arrow-key navigation and announces the category on focus.
 */
function ServiceSelector({ validationErrors = [], onSelect }) {
  const { t } = useTranslation();
  const { state, dispatch } = useRequestBuilder();

  const errors = getDisplayErrors(validationErrors);

  const orderedCategories = [...categories].sort(
    (first, second) => first.order - second.order,
  );
  const orderedServices = [...services].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-secondary uppercase rtl:normal-case rtl:tracking-normal">
        {t("request.wizard.chooseService")}
      </h3>

      <div className="grid gap-7">
        {orderedCategories.map((category) => {
          const categoryServices = orderedServices.filter(
            (service) => service.category === category.slug,
          );

          if (categoryServices.length === 0) {
            return null;
          }

          return (
            <fieldset key={category.id} className="min-w-0">
              <legend className="mb-3 text-xs font-semibold tracking-[0.18em] text-text-secondary uppercase rtl:tracking-normal rtl:normal-case">
                {t(category.titleKey)}
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {categoryServices.map((service) => {
                  const isSelected = state.selectedServiceId === service.id;

                  return (
                    <label
                      key={service.id}
                      className={`
                        flex cursor-pointer items-center gap-3 rounded-xl border
                        px-4 py-3 transition-colors duration-200
                        focus-within:ring-2 focus-within:ring-brand/50
                        ${
                          isSelected
                            ? "border-brand bg-brand/10"
                            : "border-border bg-surface hover:border-brand/50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="selectedService"
                        value={service.id}
                        checked={isSelected}
                        onChange={() => {
                          dispatch({ type: "SET_SERVICE", payload: service.id });
                          onSelect?.();
                        }}
                        className="sr-only"
                      />

                      <span
                        aria-hidden="true"
                        className={`
                          flex size-5 shrink-0 items-center justify-center
                          rounded-full border transition-colors duration-200
                          ${
                            isSelected
                              ? "border-brand bg-surface text-brand-light"
                              : "border-border text-transparent"
                          }
                        `}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>

                      <span className="min-w-0 text-sm font-medium text-text-primary">
                        {t(service.titleKey)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="mt-4 space-y-1 text-sm text-red-300">
          {errors.map((error) => (
            <li key={error.field}>{t(error.messageKey)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServiceSelector;
