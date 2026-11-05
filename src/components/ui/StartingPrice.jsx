import { useTranslation } from "react-i18next";

import formatStartingPrice from "../../lib/formatStartingPrice";

/**
 * The only money element the catalogue renders for a service or a package.
 *
 * It always states that the figure is a starting point — "Starting from
 * EGP 3,900" / "تبدأ الخدمة من 3,900 جنيه" — so the amount is never mistaken
 * for a final price. Anything that is not a confirmed amount in a named
 * currency renders nothing at all rather than an invented number.
 *
 * Sizing is left to the caller through `className`, because the same element
 * appears in a hero, a card footer and a proposal clause.
 *
 * @param {object} props
 * @param {number | null | undefined} props.amount  `startingPrice` from the data.
 * @param {string | undefined} props.currency
 * @param {string} [props.className]
 */
function StartingPrice({ amount, currency, className = "" }) {
  const { t, i18n } = useTranslation();

  const money = formatStartingPrice(
    amount,
    currency,
    i18n.resolvedLanguage,
    t,
  );

  if (!money) {
    return null;
  }

  return (
    <p className={className}>
      <span className="text-text-secondary">{t("pricing.startingFrom")}</span>{" "}
      <span className="font-bold text-text-primary">{money}</span>
    </p>
  );
}

export default StartingPrice;
