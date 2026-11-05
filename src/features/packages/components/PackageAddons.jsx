import { useTranslation } from "react-i18next";

import Checkbox from "../../../components/ui/Checkbox";

/*
  Optional add-ons for one package.

  The add-ons stay selectable so the customer can describe what the project needs,
  but no price is shown beside them and selecting one never changes any total —
  the final quotation is prepared after the scope is reviewed.
*/

function PackageAddons({ record, selectedIds = [], onToggle }) {
  const { t } = useTranslation();

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
              className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
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
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {t("pricing.customQuote")}
      </p>
    </section>
  );
}

export default PackageAddons;
