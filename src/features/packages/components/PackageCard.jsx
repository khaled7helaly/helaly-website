import { memo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Check, Clock, RefreshCw } from "lucide-react";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { getHighlightDeliverables } from "../utils/packageData";
import formatMoney from "../utils/formatMoney";

/*
  A fixed-package card.

  It shows the published base price in full — no "was/now", no discount badge and
  no "most popular" ribbon, because the catalogue supplies none of those and the
  packages are aimed at different customers rather than stacked tiers.

  The whole card is clickable through a stretched link on the package name; the
  two buttons sit above it in a raised stacking context so both stay operable.
*/

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span className="text-brand-light" aria-hidden="true">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}

function PackageCard({ record, headingLevel = 3, priority = false }) {
  const { t, i18n } = useTranslation();
  const Heading = `h${headingLevel}`;

  const detailsUrl = `/packages/${record.slug}`;
  const orderUrl = `/packages/${record.slug}#package-order`;
  const highlights = getHighlightDeliverables(record);
  const price = formatMoney(record.price, record.currency, i18n.resolvedLanguage);
  const revisions = Number.isFinite(record.revisions)
    ? t("packages.card.revisionsValue", { count: record.revisions })
    : null;

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-brand/50">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge size="sm" variant="neutral">
            {t(record.audienceLabelKey)}
          </Badge>
        </div>

        <Heading className="text-balance text-heading-md font-semibold leading-snug text-text-primary">
          <Link
            to={detailsUrl}
            className="transition-colors after:absolute after:inset-0 group-hover:text-brand-light focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-brand"
          >
            {t(record.nameKey)}
          </Link>
        </Heading>

        <p className="mt-2 text-pretty leading-relaxed text-text-secondary">
          {t(record.taglineKey)}
        </p>

        {price && (
          <div className="mt-5 border-t border-border pt-5">
            <span className="block text-sm text-text-secondary">
              {t("packages.card.priceLabel")}
            </span>
            <span className="mt-1 block text-2xl font-bold tabular-nums text-text-primary">
              {price}
            </span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <MetaItem
            icon={<Clock size={16} />}
            label={t("packages.card.deliveryLabel")}
            value={t(record.deliveryKey)}
          />

          {revisions && (
            <MetaItem
              icon={<RefreshCw size={16} />}
              label={t("packages.card.revisionsLabel")}
              value={revisions}
            />
          )}
        </div>

        {highlights.length > 0 && (
          <div className="mt-6 flex-1">
            <h4 className="text-sm font-semibold text-text-primary">
              {t("packages.card.includesLabel")}
            </h4>

            <ul className="mt-3 space-y-2">
              {highlights.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-brand-light"
                  />
                  <span className="leading-relaxed">{t(item.titleKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Wrappers carry the stacking context so both buttons stay above the
          stretched link whatever element `Button` renders. */}
      <div className="flex flex-wrap gap-3 border-t border-border p-6">
        <div className="relative z-10">
          <Button as={Link} to={detailsUrl} variant="outline" size="sm">
            {t("packages.card.viewPackage")}
          </Button>
        </div>

        <div className="relative z-10">
          <Button
            as={Link}
            to={orderUrl}
            size="sm"
            tabIndex={priority ? 0 : undefined}
          >
            {t("packages.card.orderPackage")}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default memo(PackageCard);
