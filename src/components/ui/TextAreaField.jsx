import { useId } from "react";
import { useTranslation } from "react-i18next";

function TextAreaField({
  name,
  id,
  labelKey,
  placeholderKey,
  helperTextKey,
  errorKey,
  value,
  defaultValue,
  onChange,
  rows = 5,
  required = false,
  disabled = false,
  className = "",
  textareaClassName = "",
  ...props
}) {
  const { t } = useTranslation();

  const generatedId = useId();
  const fieldId = id || `${name}-${generatedId}`;

  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

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
            <span
              className="ms-1 text-brand-bright"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={fieldId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholderKey ? t(placeholderKey) : undefined}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`
          w-full resize-y rounded-xl
          border bg-surface px-4 py-3
          text-start text-text-primary
          placeholder:text-text-secondary/60
          outline-none transition-all duration-200

          border-border
          hover:border-brand/50
          focus:border-brand
          focus:ring-2 focus:ring-brand/20

          disabled:cursor-not-allowed
          disabled:opacity-50

          ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}

          ${textareaClassName}
        `}
        {...props}
      />

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

export default TextAreaField;