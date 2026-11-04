import { useId } from "react";
import { useTranslation } from "react-i18next";

function FormField({
  labelKey,
  name,
  type = "text",
  id,
  placeholderKey,
  helperTextKey,
  errorKey,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  autoComplete,
  className = "",
  inputClassName = "",
  "aria-describedby": describedBy,
  ...props
}) {
  const { t } = useTranslation();
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = helperTextKey ? `${inputId}-helper` : undefined;
  const errorId = errorKey ? `${inputId}-error` : undefined;
  const descriptionIds = [describedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;
  const inputValueProps =
    value !== undefined ? { value } : { defaultValue };

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-text-primary"
      >
        {labelKey ? t(labelKey, { defaultValue: "" }) : null}
        {required && (
          <>
            <span className="ms-1 text-brand-light" aria-hidden="true">
              *
            </span>
            <span className="sr-only">
              {t("common.form.required", { defaultValue: "Required" })}
            </span>
          </>
        )}
      </label>

      <input
        {...props}
        {...inputValueProps}
        id={inputId}
        name={name}
        type={type}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        placeholder={
          placeholderKey
            ? t(placeholderKey, { defaultValue: "" })
            : undefined
        }
        aria-invalid={Boolean(errorKey)}
        aria-describedby={descriptionIds}
        className={`
          w-full rounded-xl border bg-surface px-4 py-3
          text-start text-text-primary placeholder:text-text-secondary
          transition-colors
          focus-visible:border-brand focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-brand/50
          disabled:cursor-not-allowed disabled:opacity-60
          ${errorKey ? "border-red-400" : "border-border"}
          ${inputClassName}
        `}
      />

      {helperTextKey && (
        <p id={helperId} className="text-sm text-text-secondary">
          {t(helperTextKey, { defaultValue: "" })}
        </p>
      )}

      {errorKey && (
        <p id={errorId} role="alert" className="text-sm text-red-300">
          {t(errorKey, { defaultValue: "" })}
        </p>
      )}
    </div>
  );
}

export default FormField;