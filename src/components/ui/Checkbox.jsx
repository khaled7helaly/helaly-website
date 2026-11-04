import { useId } from "react";
import { useTranslation } from "react-i18next";

function Checkbox({
  name,
  id,
  value,
  labelKey,
  descriptionKey,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  required = false,
  errorKey,
  className = "",
  ...props
}) {
  const { t } = useTranslation();

  const generatedId = useId();
  const fieldId = id || `${name}-${value || generatedId}`;

  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const hasError = Boolean(errorKey);

  const describedBy = [
    descriptionKey ? descriptionId : null,
    hasError ? errorId : null,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className={`
          flex items-start gap-3 cursor-pointer
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className="
            mt-1 size-4 shrink-0
            accent-neon
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-neon/40
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
          {...props}
        />

        <span className="flex flex-col gap-1">
          {labelKey && (
            <span className="text-sm font-medium text-text-primary">
              {t(labelKey)}
            </span>
          )}

          {descriptionKey && (
            <span
              id={descriptionId}
              className="text-sm text-text-secondary"
            >
              {t(descriptionKey)}
            </span>
          )}
        </span>
      </label>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-sm text-red-400"
        >
          {t(errorKey)}
        </p>
      )}
    </div>
  );
}

export default Checkbox;
