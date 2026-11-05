import { useRef } from "react";
import { Link } from "react-router";
import { useInView } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import readTranslation from "../../../lib/readTranslation";
import { services } from "../../services/utils/serviceData";

const SERVICES_PATH = "/services";

/*
  The home page carries the requests Helaly leads with, not the catalogue:
  `featured` in services.json is the switch, and the Services page stays the one
  place that lists everything. A row is the client's own sentence (the service's
  `intentKey`, "I need a website for my company") with the one line of what it
  delivers right under it. `popular` puts the star on a row.

  One column, one focal point, nothing hidden: the sentence, what you get, and a
  clear arrow to go. The only motion is the lines between the rows. They draw
  themselves once when the list arrives, and a brand line fills across a row on
  hover or focus. Transforms only, no scroll listeners, no layout changes.
  Reduced motion gets the lines already drawn and no transitions.
*/
const REQUESTS = services.filter((service) => service.featured);

const FADE = "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)";
const FADE_MASK = { maskImage: FADE, WebkitMaskImage: FADE };

// Two soft splashes of colour, painted once. Logical offsets, so RTL mirrors itself.
const GLOW_A = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 20%, transparent), transparent)",
};
const GLOW_B = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand-deep) 38%, transparent), transparent)",
};

function Rule({ drawn, delay, className }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-px origin-left bg-border transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] rtl:origin-right motion-reduce:scale-x-100 motion-reduce:transition-none ${
        drawn ? "scale-x-100" : "scale-x-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    />
  );
}

function ServiceRequest({ service, index, drawn }) {
  const { t } = useTranslation();

  const intent = readTranslation(t, service.intentKey);
  const preview = readTranslation(t, service.previewDescriptionKey);

  if (!intent) {
    return null;
  }

  return (
    <li className="relative">
      <Link
        to={service.url}
        className="group relative flex items-start justify-between gap-5 rounded-lg py-6 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon sm:gap-8 sm:py-7"
      >
        <span className="min-w-0">
          <span className="block max-w-3xl text-body font-medium leading-[1.5] text-pretty text-text-primary transition-colors duration-300 group-hover:text-brand-light group-focus-visible:text-brand-light motion-reduce:transition-none sm:text-xl lg:text-2xl">
            {intent}
          </span>

          {preview ? (
            <span className="mt-2 block max-w-2xl text-small leading-[1.7] text-pretty text-text-secondary">
              {preview}
            </span>
          ) : null}
        </span>

        <span className="flex shrink-0 items-center gap-3 sm:gap-4">
          {service.popular ? (
            <>
              <Star size={14} aria-hidden="true" fill="currentColor" className="text-brand-light" />
              <span className="sr-only">{t("common.featured")}</span>
            </>
          ) : null}

          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-300 group-hover:border-brand/50 group-hover:bg-accent-soft group-hover:text-brand-light group-focus-visible:border-brand/50 group-focus-visible:bg-accent-soft group-focus-visible:text-brand-light motion-reduce:transition-none"
          >
            <ArrowUpRight
              size={18}
              className="transition-[translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </span>

        {/* The line under the row: draws once, then a brand line fills over it. */}
        <Rule drawn={drawn} delay={(index + 1) * 70} className="bottom-0" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

function ServicesPreview() {
  const { t } = useTranslation();
  const listRef = useRef(null);
  const drawn = useInView(listRef, { once: true, amount: 0.15 });

  return (
    <section className="relative isolate border-t border-border py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={FADE_MASK}
      >
        <span className="absolute -top-16 -end-32 size-[36rem] rounded-full" style={GLOW_A} />
        <span className="absolute -bottom-24 -start-32 size-[32rem] rounded-full" style={GLOW_B} />
      </div>

      <Container>
        <SectionHeading
          eyebrow={t("common.services")}
          title={t("home.servicesTitle")}
          description={t("home.servicesDescription")}
          className="max-w-3xl"
        />

        <ul ref={listRef} className="relative mt-10 sm:mt-12">
          <Rule drawn={drawn} delay={0} className="top-0" />
          {REQUESTS.map((service, index) => (
            <ServiceRequest key={service.id} service={service} index={index} drawn={drawn} />
          ))}
        </ul>

        {/* One action, not two. The section's job is to lead into the
            catalogue, so the button wears the brand fill and the request flow
            keeps starting where it belongs: on a service page or a proposal. */}
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