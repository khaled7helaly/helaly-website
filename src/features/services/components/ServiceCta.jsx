import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";
import buildRequestUrl from "../../request/utils/buildRequestUrl";

/**
 * Closing conversion block.
 *
 * The primary action is the same `buildRequestUrl` link the hero uses, so the
 * existing request wizard receives the service slug and preselects it. When a
 * service has no usable slug the helper returns the bare request route, which
 * opens the wizard with nothing preselected instead of guessing.
 */
function ServiceCta({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const title = readTranslation(t, service.titleKey);

  return (
    <section className="border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 sm:px-10 lg:px-14 lg:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "var(--ambient-brand-glow)" }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute end-[-4rem] bottom-[-6rem] hidden lg:block"
          >
            {/* Neutral rings: they frame the block without tinting it. */}
            <div className="size-64 rounded-full border border-border" />
            <div className="absolute inset-10 rounded-full border border-border/60" />
          </div>

          <div className="relative max-w-2xl">
            <p className="text-small font-semibold tracking-[0.24em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
              {t("services.cta.eyebrow")}
            </p>

            <h2 className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] font-bold tracking-tight text-balance text-text-primary rtl:leading-[1.3] rtl:tracking-normal">
              {t("services.cta.title")}
            </h2>

            <p className="mt-5 text-body leading-[1.75] text-text-secondary">
              {t("services.cta.description", { service: title })}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                as={Link}
                to={buildRequestUrl(service.slug)}
                size="lg"
                className="group rounded-xl"
              >
                {t("services.startThisProject")}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 rtl:-scale-x-100 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
              </Button>

              <Button
                as={Link}
                to="/contact"
                variant="outline"
                size="lg"
                className="rounded-xl"
              >
                {t("services.cta.talk")}
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default ServiceCta;
