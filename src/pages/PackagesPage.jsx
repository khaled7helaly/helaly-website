import { useTranslation } from "react-i18next";

import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import PackageCatalog from "../features/packages/components/PackageCatalog";
import PackageComparison from "../features/packages/components/PackageComparison";
import PackageFaq from "../features/packages/components/PackageFaq";
import PackageTerms from "../features/packages/components/PackageTerms";

/*
  Path B — the fixed-package catalogue.

  It stays a separate destination from `/services`: the catalogue links across to
  the custom path, and nothing here routes a package through the request wizard.
*/

function PackagesPage() {
  const { t } = useTranslation();

  return (
    <div className="pb-20 sm:pb-24">
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow={t("packages.pageEyebrow")}
            title={t("packages.pageTitle")}
            description={t("packages.pageDescription")}
            className="mb-10 sm:mb-12"
          />

          <PackageCatalog headingLevel={2} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <PackageComparison headingLevel={2} />
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
    </div>
  );
}

export default PackagesPage;
