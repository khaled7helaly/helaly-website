import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import readTranslation from "../../../lib/readTranslation";
import { services } from "../../services/utils/serviceData";

const SERVICES_PATH = "/services";
const EASE = [0.22, 1, 0.36, 1];

/*
  The home page carries the requests Helaly leads with, not the catalogue:
  `featured` in services.json is the switch, and the Services page stays the one
  place that lists everything. A row is the client's own sentence — the service's
  `intentKey`, "I need a website for my company" — so the section reads as a list
  of requests to choose from rather than another grid of cards. `popular` in the
  same file is what puts the single star on a row; nothing here invents a
  ranking of its own.
*/
const REQUESTS = services.filter((service) => service.featured);

function ServiceRequest({ service, index }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const intent = readTranslation(t, service.intentKey);
  const preview = readTranslation(t, service.previewDescriptionKey);

  if (!intent) {
    return null;
  }

  return (
    <motion.li
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: 0.45,
        delay: prefersReducedMotion ? 0 : index * 0.05,
        ease: EASE,
      }}
    >
      <Link
        to={service.url}
        className="group flex flex-col rounded-lg px-3 py-4 outline-offset-2 transition-colors duration-200 hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon motion-reduce:transition-none sm:px-4"
      >
        <span className="flex items-center justify-between gap-4">
          <span className="text-body font-medium text-pretty text-text-primary transition-colors duration-200 group-hover:text-brand-light motion-reduce:transition-none sm:text-lg">
            {intent}
          </span>

          <span className="flex shrink-0 items-center gap-3">
            {service.popular ? (
              <>
                <Star size={14} aria-hidden="true" fill="currentColor" className="text-brand-light" />
                <span className="sr-only">{t("common.featured")}</span>
              </>
            ) : null}

            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="text-text-secondary transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-light rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </span>

        {/* What the request delivers, one line, stored with the service in
            services.json. At rest it is folded away inside its own mask and
            opens on hover or keyboard focus. A touch device has no hover to
            give, so there it is simply open (see `.service-request-description`
            in src/styles/index.css). */}
        {preview ? (
          <div className="service-request-description grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 motion-reduce:transition-none">
            <div className="overflow-hidden">
              <p className="pt-2 text-small leading-[1.7] text-pretty text-text-secondary">
                {preview}
              </p>
            </div>
          </div>
        ) : null}
      </Link>
    </motion.li>
  );
}

function ServicesPreview() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("common.services")}
          title={t("home.servicesTitle")}
          description={t("home.servicesDescription")}
          className="max-w-3xl"
        />

        <ul className="mt-10 divide-y divide-border border-y border-border sm:mt-12">
          {REQUESTS.map((service, index) => (
            <ServiceRequest key={service.id} service={service} index={index} />
          ))}
        </ul>

        {/* One action, not two. The section's job is to lead into the
            catalogue, so the button wears the brand fill and the request flow
            keeps starting where it belongs — on a service page or a proposal. */}
        <div className="mt-10 flex">
          <Button
            as={Link}
            to={SERVICES_PATH}
            variant="brand"
            size="lg"
            className="group min-h-12 w-full justify-center rounded-full sm:w-auto"
          >
            {t("home.servicesExplore")}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;
