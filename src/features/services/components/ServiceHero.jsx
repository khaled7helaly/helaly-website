import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import Price from "../../../components/ui/Price";
import { SERVICES_PATH } from "../../../components/layout/navigation";
import readTranslation from "../../../lib/readTranslation";
import buildRequestUrl from "../../request/utils/buildRequestUrl";
import LaptopShowcase from "../preview/LaptopShowcase";
import { getProposalByServiceSlug } from "../utils/proposals";
import ServiceHeroBackdrop from "./ServiceHeroBackdrop";

const EASE = [0.22, 1, 0.36, 1];

function revealMotion(prefersReducedMotion, delay) {
  return {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: prefersReducedMotion ? 0 : delay,
      ease: EASE,
    },
  };
}

/**
 * Service hero.
 *
 * It answers three questions in order — what this is, who it is for, what you
 * get — and then offers the two actions the journey actually needs: request the
 * service, or read its proposal. The supporting line prefers the written
 * description and falls back to the catalogue's one-line summary, so a service
 * whose proposal is still an outline never shows an empty paragraph.
 */
function ServiceHero({ service, ordinal = 0 }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const title = readTranslation(t, service.titleKey);
  const intent = readTranslation(t, service.intentKey);
  const description =
    readTranslation(t, service.descriptionKey) ||
    readTranslation(t, service.shortDescriptionKey);
  const categoryTitle = readTranslation(
    t,
    `services.categories.${service.category}.title`,
  );
  const hasPrice = service.price != null && Boolean(service.currency);
  const hasDescription = description.length > 0;
  // The anchor below only has somewhere to go while the proposal is rendered,
  // which `ServiceProposal` does for finished documents only.
  const hasProposal =
    getProposalByServiceSlug(service.slug)?.status === "complete";

  // `service-hero` keeps the page's own semantic tokens, so the hero follows
  // the active theme — dark surface on dark, light surface on light — and the
  // proposal below it reads as the same surface.
  return (
    <section className="service-hero relative isolate overflow-hidden pt-10 pb-20 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-28">
      <ServiceHeroBackdrop service={service} />

      {/* The service name again, oversized and heavily de-emphasised, so the
          hero reads as branded without the wordmark competing with the h1.
          Hidden from assistive tech: the h1 already says it. */}
      {title ? (
        <span aria-hidden="true" className="service-hero-watermark">
          {title}
        </span>
      ) : null}

      <Container>
        <motion.div {...revealMotion(prefersReducedMotion, 0)}>
          <Link
            to={SERVICES_PATH}
            className="inline-flex items-center gap-2 rounded-sm text-small font-medium text-text-secondary transition-colors duration-300 hover:text-brand-light focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {t("common.backToServices")}
          </Link>
        </motion.div>

        <div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            {categoryTitle ? (
              <motion.p
                {...revealMotion(prefersReducedMotion, 0.05)}
                className="text-small font-semibold tracking-[0.24em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal"
              >
                {categoryTitle}
              </motion.p>
            ) : null}

            <motion.h1
              {...revealMotion(prefersReducedMotion, 0.1)}
              className={`text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] font-bold tracking-tight text-balance text-text-primary rtl:leading-[1.3] rtl:tracking-normal ${
                categoryTitle ? "mt-5" : ""
              }`}
            >
              {title}
            </motion.h1>

            {/* The catalogue's own headline, in the customer's voice: it says
                what the service is for before the description explains it. */}
            {intent ? (
              <motion.p
                {...revealMotion(prefersReducedMotion, 0.14)}
                className="mt-5 max-w-[46ch] text-heading-md leading-snug font-medium text-balance text-text-primary"
              >
                {intent}
              </motion.p>
            ) : null}

            {hasDescription ? (
              <motion.p
                {...revealMotion(prefersReducedMotion, 0.18)}
                className="mt-4 max-w-[50ch] text-body leading-[1.75] text-text-secondary"
              >
                {description}
              </motion.p>
            ) : null}

            {/* Only configured prices are shown; `Price` renders nothing when the
                amount is missing, and the guard keeps the spacing collapse-free. */}
            {hasPrice ? (
              <motion.div
                {...revealMotion(prefersReducedMotion, 0.2)}
                className="mt-6"
              >
                <Price
                  amount={service.price}
                  currency={service.currency}
                  label={t("services.startingPrice")}
                />
              </motion.div>
            ) : null}

            <motion.div
              {...revealMotion(prefersReducedMotion, 0.24)}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button as={Link} to={buildRequestUrl(service.slug)}>
                {t("services.startThisProject")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Button>

              {/* Same-page anchor: the proposal is the next thing to read. */}
              {hasProposal ? (
                <Button as="a" href="#proposal" variant="outline">
                  {t("services.proposal.viewProposal")}
                </Button>
              ) : null}
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* Keyed so navigating between services replays the entrance
                instead of morphing one screen's layout into another's. */}
            <LaptopShowcase key={service.slug} service={service} ordinal={ordinal} />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ServiceHero;
