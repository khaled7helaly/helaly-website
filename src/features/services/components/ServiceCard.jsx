import { memo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Blocks, Code, Megaphone, PenTool, Star } from "lucide-react";

import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import StartingPrice from "../../../components/ui/StartingPrice";
import readTranslation from "../../../lib/readTranslation";
import buildRequestUrl from "../../request/utils/buildRequestUrl";

/*
  Horizontal service card: media on the start side, information on the end side.

  The row direction is logical, so RTL mirrors it automatically without a
  direction branch. Only three services carry an `image`, so the remaining cards
  fall back to a neutral panel with the category's own glyph — no stock imagery
  is invented to fill the space.
*/

const CATEGORY_GLYPHS = {
  "web-development": Code,
  applications: Blocks,
  "ui-ux-design": PenTool,
  "digital-marketing": Megaphone,
};

function CategoryPanel({ category }) {
  const Glyph = CATEGORY_GLYPHS[category] ?? Code;

  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center bg-surface-raised"
    >
      <Glyph size={40} strokeWidth={1.25} className="text-text-secondary/50" />
    </div>
  );
}

function ServiceCard({ service, priority = false, headingLevel = 3 }) {
  const { t } = useTranslation();
  const Heading = `h${headingLevel}`;
  const title = readTranslation(t, service.titleKey);
  const detailsUrl = `/services/${service.slug}`;
  // Not every service has a long description yet; the short one is written for
  // exactly this space, so it is the fallback rather than an empty paragraph.
  const description =
    readTranslation(t, service.descriptionKey) ||
    readTranslation(t, service.shortDescriptionKey);

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-brand/50 sm:flex-row">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-raised sm:aspect-auto sm:w-44 lg:w-56">
        {service.image ? (
          // The title sits beside it, so the image is decorative (empty alt).
          <img
            src={service.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <CategoryPanel category={service.category} />
        )}

        {service.featured && (
          <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary">
            <Star
              size={14}
              aria-hidden="true"
              className="text-brand-light"
              fill="currentColor"
            />
            {t("common.featured")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex">
          <Badge size="sm">{t(`services.categories.${service.category}.title`)}</Badge>
        </div>

        <Heading className="text-balance text-heading-md font-semibold leading-snug text-text-primary">
          {/* Stretched link: the ::after covers the whole card, so the entire
              card is clickable and the keyboard focus ring wraps the card. */}
          <Link
            to={detailsUrl}
            className="transition-colors after:absolute after:inset-0 group-hover:text-brand-light focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-brand"
          >
            {title}
          </Link>
        </Heading>

        {description ? (
          <p className="mt-2 line-clamp-3 flex-1 leading-relaxed text-text-secondary">
            {description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <StartingPrice
            amount={service.startingPrice}
            currency={service.currency}
          />

          {/* Wrappers (not the Buttons) carry relative z-10, so the actions
              stay clickable above the stretched link whatever Button renders. */}
          <div className="flex flex-wrap gap-3">
            <div className="relative z-10">
              <Button as={Link} to={detailsUrl} variant="outline" size="sm">
                {t("common.viewDetails")}
              </Button>
            </div>
            <div className="relative z-10">
              <Button as={Link} to={buildRequestUrl(service.slug)} size="sm">
                {t("common.requestService")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ServiceCard);
