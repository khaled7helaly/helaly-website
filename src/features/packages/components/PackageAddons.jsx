import { useTranslation } from "react-i18next";

import Checkbox from "../../../components/ui/Checkbox";
import describeAddonPrice from "../utils/describeAddonPrice";

/*
  Optional add-ons for one package.

  The price shown beside each row matches the pricing type exactly: a firm amount
  for `fixed`, "starting from" for `from`, and "at cost" for a pass-through cost.
  Selecting an `at-cost` or `from` add-on never changes the known subtotal — see
  `calculatePackagePrice`.
*/

function PackageAddons({ record, selectedIds = [], onToggle }) {
  const { t, i18n } = useTranslation();

  if (!record.addons.length) return null;

  return (
    <section aria-labelledby="package-addons-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3
          id="package-addons-title"
          className="text-base font-semibold text-text-primary"
        >
          {t("packages.addonPanel.title")}
        </h3>

        <span className="text-sm text-text-secondary" aria-live="polite">
          {t("packages.addonPanel.selectedCount", {
            count: selectedIds.length,
          })}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {t("packages.addonPanel.description")}
      </p>

      <ul className="mt-4 space-y-3">
        {record.addons.map((addon) => {
          const isSelected = selectedIds.includes(addon.id);

          return (
            <li
              key={addon.id}
              className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                isSelected
                  ? "border-brand/50 bg-brand/5"
                  : "border-border bg-surface"
              }`}
            >
              <Checkbox
                className="flex-1"
                name={`package-addon-${record.id}`}
                value={addon.id}
                labelKey={addon.titleKey}
                descriptionKey={addon.noteKey}
                checked={isSelected}
                onChange={() => onToggle(addon.id)}
              />

              <span className="shrink-0 pt-0.5 text-sm font-medium tabular-nums text-text-primary">
                {describeAddonPrice(addon, t, i18n.resolvedLanguage)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default PackageAddons;
