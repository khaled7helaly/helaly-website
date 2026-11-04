import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

/*
  Search field for the services catalogue.

  It is a plain labelled input with a real `<label>` and a native `type="search"`
  field, so it is reachable by keyboard and announced by a screen reader without
  extra ARIA. The native clear affordance is hidden because the toolbar supplies
  its own labelled one, and the result count lives in a polite live region so a
  screen reader hears the count change as you type.
*/

function ServiceSearch({ value = "", onChange, resultCount, className = "" }) {
  const { t } = useTranslation();
  const fieldId = useId();
  const hasQuery = value.trim().length > 0;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-text-primary"
      >
        {t("services.search.label")}
      </label>

      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />

        <input
          id={fieldId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("services.search.placeholder")}
          autoComplete="off"
          className="
            w-full rounded-xl border border-border bg-surface
            py-3 ps-11 pe-11
            text-start text-text-primary
            placeholder:text-text-secondary
            transition-colors
            hover:border-brand/50
            focus-visible:border-brand focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-brand/50
            [&::-webkit-search-cancel-button]:appearance-none
          "
        />

        {hasQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={t("services.search.clear")}
            className="
              absolute end-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center
              rounded-full text-text-secondary
              transition-colors hover:bg-surface-raised hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
            "
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-[1.25rem] text-sm leading-5 text-text-secondary"
      >
        {Number.isFinite(resultCount)
          ? t("services.search.resultsCount", { count: resultCount })
          : null}

        {hasQuery && (
          <span className="ms-2">
            {t("services.search.activeQuery", { query: value.trim() })}
          </span>
        )}
      </p>
    </div>
  );
}

export default ServiceSearch;
