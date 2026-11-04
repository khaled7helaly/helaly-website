import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Clock, RefreshCw } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import EmptyState from "../components/ui/EmptyState";
import PackageFaq from "../features/packages/components/PackageFaq";
import PackageInquiryForm from "../features/packages/components/PackageInquiryForm";
import PackageProposalDocument from "../features/packages/components/PackageProposalDocument";
import PackageTerms from "../features/packages/components/PackageTerms";
import { getPackageBySlug } from "../features/packages/utils/packageData";
import formatMoney from "../features/packages/utils/formatMoney";

/*
  Path B detail — one package, end to end: proposal document, order form, shared
  FAQ and terms. The order block is the only place an order can start, and it
  links back to the custom services path for anything outside the fixed scope.
*/

function PackageNotFound() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <EmptyState
          titleKey="packages.details.notFoundTitle"
          descriptionKey="packages.details.notFoundBody"
          actionLabelKey="packages.details.backToPackages"
          actionTo="/packages"
        />
      </Container>
    </section>
  );
}

function PackageHero({ record }) {
  const { t, i18n } = useTranslation();
  const price = formatMoney(record.price, record.currency, i18n.resolvedLanguage);
  const revisions = Number.isFinite(record.revisions)
    ? t("packages.card.revisionsValue", { count: record.revisions })
    : null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Button as={Link} to="/packages" variant="ghost" size="sm" className="mb-6">
          <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
          {t("packages.details.backToPackages")}
        </Button>

        <div className="max-w-3xl">
          <Badge size="sm" variant="neutral">
            {t(record.audienceLabelKey)}
          </Badge>

          <h1 className="mt-4 text-balance text-heading-lg font-bold leading-tight tracking-tight text-text-primary rtl:leading-snug rtl:tracking-normal">
            {t(record.nameKey)}
          </h1>

          <p className="mt-4 text-pretty text-body leading-relaxed text-text-secondary">
            {t(record.taglineKey)}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-5">
          {price && (
            <div>
              <span className="block text-sm text-text-secondary">
                {t("packages.details.priceTitle")}
              </span>
              <span className="mt-1 block text-3xl font-bold tabular-nums text-text-primary">
                {price}
              </span>
            </div>
          )}

          <div>
            <span className="block text-sm text-text-secondary">
              {t("packages.card.deliveryLabel")}
            </span>
            <span className="mt-1 flex items-center gap-2 text-text-primary">
              <Clock size={16} aria-hidden="true" className="text-brand-light" />
              {t(record.deliveryKey)}
            </span>
          </div>

          {revisions && (
            <div>
              <span className="block text-sm text-text-secondary">
                {t("packages.card.revisionsLabel")}
              </span>
              <span className="mt-1 flex items-center gap-2 text-text-primary">
                <RefreshCw size={16} aria-hidden="true" className="text-brand-light" />
                {revisions}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button as="a" href="#package-order" size="lg">
            {t("packages.card.orderPackage")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

function RelatedServicesBlock() {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-heading-md font-semibold text-text-primary">
        {t("packages.details.relatedServicesTitle")}
      </h2>

      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-text-secondary">
        {t("packages.details.relatedServicesBody")}
      </p>

      <Button as={Link} to="/services" variant="outline" className="mt-6">
        {t("packages.details.relatedServicesCta")}
      </Button>
    </section>
  );
}

function PackageDetailsPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const record = getPackageBySlug(slug);

  if (!record) {
    return <PackageNotFound />;
  }

  return (
    <div className="pb-20 sm:pb-24">
      <PackageHero record={record} />

      <section className="py-6 sm:py-8">
        <Container>
          <PackageProposalDocument record={record} />
        </Container>
      </section>

      <section id="package-order" className="scroll-mt-28 py-16 sm:py-20">
        <Container>
          <h2 className="text-heading-md font-semibold text-text-primary">
            {t("packages.form.title")}
          </h2>

          <p className="mt-3 mb-8 max-w-2xl text-pretty leading-relaxed text-text-secondary">
            {t("packages.form.description")}
          </p>

          <PackageInquiryForm record={record} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <PackageFaq />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <PackageTerms />
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <RelatedServicesBlock />
        </Container>
      </section>
    </div>
  );
}

export default PackageDetailsPage;
