import { useTranslation } from "react-i18next";

function Price({
  amount,
  currency,
  label,
  className = "",
}) {
  const { i18n } = useTranslation();

  if (amount == null || !currency || !Number.isFinite(amount)) {
    return null;
  }

  const locale =
    i18n.resolvedLanguage === "ar" ? "ar-EG" : "en-US";

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-sm text-text-secondary">
          {label}
        </span>
      )}
      <span className="font-bold text-text-primary">
        {formattedPrice}
      </span>
    </div>
  );
}

export default Price;