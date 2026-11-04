import { useTranslation } from "react-i18next";

import Accordion from "../../../components/ui/Accordion";
import SectionHeading from "../../../components/ui/SectionHeading";
import { getPackageFaqItems } from "../utils/packageContent";

/*
  One FAQ block shared by every package: the answers are commercial policy, not
  package-specific, so they live in the locale files rather than being repeated
  in `packages.json`.
*/

function PackageFaq() {
  const { t } = useTranslation();
  const items = getPackageFaqItems();

  return (
    <section>
      <SectionHeading
        eyebrow={t("packages.pageEyebrow")}
        title={t("packages.faq.title")}
        description={t("packages.faq.description")}
        className="mb-6"
      />

      <Accordion items={items} allowMultiple />
    </section>
  );
}

export default PackageFaq;
