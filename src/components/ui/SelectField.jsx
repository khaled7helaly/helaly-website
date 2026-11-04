import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

function SelectField({
  name,
  id,
  labelKey,
  placeholderKey,
  options = [],
  value,
  defaultValue,
  onChange,
  helperTextKey,
  errorKey,
  required = false,
  disabled = false,
  className = "",
  selectClassName = "",
  ...props
}) {
  const { t } = useTranslation();

  const generatedId = useId();
  const fieldId = id || `${name}-${generatedId}`;

  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const isControlled = value !== undefined;
  const hasError = Boolean(errorKey);

  const describedBy = [
    props["aria-describedby"],
    helperTextKey ? helperId : null,
    hasError ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {labelKey && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-text-primary"
        >
          {t(labelKey)}

          {required && (
            <span className="ms-1 text-brand-bright" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={fieldId}
          name={name}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={`
            w-full appearance-none rounded-xl
            border bg-surface px-4 py-3 pe-11
            text-start text-text-primary
            outline-none transition-all duration-200

            border-border
            hover:border-brand/50
            focus:border-brand
            focus:ring-2 focus:ring-brand/20

            disabled:cursor-not-allowed
            disabled:opacity-50

            ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}

            ${selectClassName}
          `}
          {...props}
        >
          {placeholderKey && (
            <option value="" disabled={required}>
              {t(placeholderKey)}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.labelKey
                ? t(option.labelKey)
                : option.label || option.value}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
      </div>

      {helperTextKey && (
        <p
          id={helperId}
          className="text-sm text-text-secondary"
        >
          {t(helperTextKey)}
        </p>
      )}

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-400"
        >
          {t(errorKey)}
        </p>
      )}
    </div>
  );
}

export default SelectField;