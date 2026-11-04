import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

const EASE = [0.22, 1, 0.36, 1];

/**
 * What the client receives on handoff.
 *
 * Every line comes from `service.deliverables`. Hosting, maintenance windows,
 * revision counts and deadlines are deliberately not generated here: they are
 * commercial terms and only appear when a service configures them.
 */
function ServiceDeliverables({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const deliverables = (Array.isArray(service.deliverables)
    ? service.deliverables
    : []
  )
    .map((item, index) => ({
      id: `${item?.titleKey ?? "deliverable"}-${index}`,
      title: readTranslation(t, item?.titleKey),
      description: readTranslation(t, item?.descriptionKey),
    }))
    .filter((item) => item.title.length > 0);

  if (deliverables.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="rounded-[2rem] border border-border bg-surface/60 p-6 sm:p-9 lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-small font-semibold tracking-[0.2em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
              {t("services.deliverables.title")}
            </h2>
            <p className="mt-5 text-body leading-[1.75] text-text-secondary">
              {t("services.deliverables.description")}
            </p>
          </div>

          <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {deliverables.map((item, index) => (
              <motion.li
                key={item.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : index * 0.04,
                  ease: EASE,
                }}
                className="flex items-start gap-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand-light"
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>

                <span className="min-w-0">
                  <span className="block text-base font-medium text-text-primary">
                    {item.title}
                  </span>
                  {item.description ? (
                    <span className="mt-1 block text-small leading-[1.7] text-text-secondary">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default ServiceDeliverables;
