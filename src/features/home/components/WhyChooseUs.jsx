import { Accessibility, Gauge, Layers, MessagesSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";

const VALUE_POINTS = [
  {
    id: "tailored",
    icon: Layers,
    titleKey: "whyChooseUs.values.tailored.title",
    descriptionKey: "whyChooseUs.values.tailored.description",
  },
  {
    id: "userCentered",
    icon: Accessibility,
    titleKey: "whyChooseUs.values.userCentered.title",
    descriptionKey: "whyChooseUs.values.userCentered.description",
  },
  {
    id: "performance",
    icon: Gauge,
    titleKey: "whyChooseUs.values.performance.title",
    descriptionKey: "whyChooseUs.values.performance.description",
  },
  {
    id: "communication",
    icon: MessagesSquare,
    titleKey: "whyChooseUs.values.communication.title",
    descriptionKey: "whyChooseUs.values.communication.description",
  },
];

const REVEAL_EASE = [0.22, 1, 0.36, 1];

function WhyChooseUs() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    prefersReducedMotion
      ? {
          initial: false,
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.55, delay, ease: REVEAL_EASE },
        };

  return (
    <section
      aria-label={t("whyChooseUs.title")}
      className="border-t border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div className="lg:col-span-6" {...reveal()}>
            <p className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-light rtl:normal-case rtl:tracking-normal">
              <span aria-hidden="true" className="size-2 rounded-full bg-neon shadow-sm shadow-neon/50" />
              {t("whyChooseUs.eyebrow")}
            </p>
            <SectionHeading
              title={t("whyChooseUs.title")}
              description={t("whyChooseUs.description")}
              className="max-w-2xl"
            />
          </motion.div>

          <motion.div
            className="lg:col-span-5 lg:col-start-8"
            {...reveal(0.12)}
          >
            <div className="border-s-2 border-brand ps-5 sm:ps-6">
              <span
                aria-hidden="true"
                className="mb-4 block h-0.5 w-10 rounded-full bg-neon"
              />
              <p className="max-w-xl text-heading-md font-semibold leading-snug text-text-primary sm:text-3xl">
                {t("whyChooseUs.coreMessage")}
              </p>
            </div>
          </motion.div>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-9 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-7 xl:gap-x-10">
          {VALUE_POINTS.map(({ id, icon: Icon, titleKey, descriptionKey }, index) => (
            <li key={id} className="min-w-0 border-t border-border pt-5 sm:pt-6">
              <motion.article {...reveal(index * 0.08)}>
                <div className="flex items-center justify-between gap-4">
                  <bdi
                    dir="ltr"
                    aria-hidden="true"
                    className="font-mono text-sm font-medium text-brand-light"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </bdi>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-brand-light">
                    <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold leading-snug text-text-primary">
                  {t(titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {t(descriptionKey)}
                </p>
              </motion.article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default WhyChooseUs;
