import { useTranslation } from "react-i18next";

import Accordion from "../../../components/ui/Accordion";
import Container from "../../../components/ui/Container";
import FAQ_ITEMS from "../../../data/faqs";

// Resolved once at module scope: the FAQ list is static, so a per-render map
// would only repeat the same lookup for every service.
const FAQ_BY_ID = new Map(FAQ_ITEMS.map((item) => [item.id, item]));

/**
 * Service-specific questions, drawn from the shared FAQ data.
 *
 * A service opts in with `faqIds`, so the section only appears when questions
 * genuinely apply to it. No service-specific copy is authored here — that would
 * create a second FAQ source next to `src/data/faqs.js`.
 */
function ServiceFaq({ service }) {
  const { t } = useTranslation();

  const faqIds = Array.isArray(service.faqIds) ? service.faqIds : [];
  const items = faqIds
    .map((id) => FAQ_BY_ID.get(id))
    .filter((item) => item !== undefined);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
              {t("services.faq.title")}
            </h2>
            <p className="mt-5 max-w-md text-body leading-[1.75] text-text-secondary">
              {t("services.faq.description")}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface">
              <Accordion
                items={items}
                defaultOpenIds={items[0] ? [items[0].id] : []}
                className="divide-y divide-border"
                itemClassName="px-5 py-1 sm:px-6"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ServiceFaq;
