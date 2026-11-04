import { memo } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import BrandLogo from "../brand/BrandLogo";
import Button from "../ui/Button";
import Container from "../ui/Container";
import categories from "../../data/serviceCategories.json";
import services from "../../data/services.json";
import contact from "../../config/contact";
import getSafeExternalUrl from "../../lib/getSafeExternalUrl";
import SOCIAL_ICONS from "../../lib/socialIcons";
import { NAVIGATION_ITEMS, PROJECT_PATH, SERVICES_PATH } from "./navigation";

const COPYRIGHT_YEAR = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Static data: built once when the module loads, not on every render.
// ---------------------------------------------------------------------------

function buildContactMethods() {
  const whatsappNumber = contact.whatsappBusinessNumber?.replace(/\D/gu, "") ?? "";
  const email = contact.businessEmail?.trim() ?? "";
  const phone = contact.phoneNumber?.trim() ?? "";
  const phoneHref = phone.replace(/[^\d+]/gu, "");
  const hasWhatsApp = /^\d{8,15}$/u.test(whatsappNumber);
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email);
  const hasPhone = /^\+?\d{7,15}$/u.test(phoneHref);

  return [
    hasEmail && {
      key: "email",
      labelKey: "footer.businessEmail",
      value: email,
      href: `mailto:${encodeURI(email)}`,
      Icon: Mail,
    },
    hasWhatsApp && {
      key: "whatsapp",
      labelKey: "footer.whatsapp",
      value: `+${whatsappNumber}`,
      href: `https://wa.me/${whatsappNumber}`,
      ariaLabelKey: "footer.whatsappLabel",
      external: true,
      Icon: MessageCircle,
    },
    hasPhone && {
      key: "phone",
      labelKey: "footer.phone",
      value: phone,
      href: `tel:${phoneHref}`,
      Icon: Phone,
    },
  ].filter(Boolean);
}

function buildSocialLinks() {
  const links = Array.isArray(contact.socialLinks) ? contact.socialLinks : [];

  return links
    .map((item) => ({
      ...item,
      safeUrl: getSafeExternalUrl(item.url),
      paths: SOCIAL_ICONS[item.id],
    }))
    .filter(
      (item) =>
        item.safeUrl &&
        item.paths &&
        typeof item.label === "string" &&
        item.label.trim(),
    );
}

function buildServiceGroups() {
  const featuredByCategory = new Map();
  const featuredServices = services
    .filter((service) => service.featured)
    .sort((a, b) => a.order - b.order);

  for (const service of featuredServices) {
    if (!featuredByCategory.has(service.category)) {
      featuredByCategory.set(service.category, service);
    }
  }

  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      featured: featuredByCategory.get(category.slug),
    }));
}

const CONTACT_METHODS = buildContactMethods();
const SOCIAL_LINKS = buildSocialLinks();
const SERVICE_GROUPS = buildServiceGroups();

const HAS_CONTACT = CONTACT_METHODS.length > 0;
const HAS_SOCIAL = SOCIAL_LINKS.length > 0;

// Full class strings (never built piece by piece) so Tailwind can see them.
const COLUMNS_CLASS = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-[0.8fr_1.3fr_1.1fr]",
  4: "lg:grid-cols-[0.8fr_1.3fr_1.1fr_0.9fr]",
}[2 + Number(HAS_CONTACT) + Number(HAS_SOCIAL)];

// ---------------------------------------------------------------------------
// Styles. The underline draws in from the inline start (transform only).
// ---------------------------------------------------------------------------

const HEADING =
  "text-xs font-semibold uppercase tracking-[0.16em] text-text-primary rtl:tracking-normal";

const LINK_BASE =
  "relative inline-flex w-fit rounded-sm py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-light after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none rtl:after:origin-right";
const LINK_MUTED = `${LINK_BASE} text-sm text-text-secondary hover:text-text-primary`;
const LINK_SUB = `${LINK_BASE} text-xs text-text-secondary hover:text-text-primary`;
const LINK_STRONG = `${LINK_BASE} text-sm font-medium text-text-primary hover:text-brand-light`;
const LINK_CTA = `${LINK_BASE} mt-4 items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-brand-light`;

// One tile treatment for every small mark in the footer — the contact row
// icons and the social marks — so the two groups read as the same family.
const TILE =
  "flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-raised text-text-secondary transition-colors duration-200 group-hover:border-brand/40 group-hover:bg-brand/10 group-hover:text-brand-light group-focus-visible:border-brand/40 group-focus-visible:bg-brand/10 group-focus-visible:text-brand-light motion-reduce:transition-none";

// ---------------------------------------------------------------------------
// Motion: one quick, orchestrated reveal. Static objects, created once.
// ---------------------------------------------------------------------------

const EASE = [0.22, 1, 0.36, 1];

const REVEAL = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "0px 0px -8% 0px" },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function Footer() {
  const { t } = useTranslation();
  const reveal = useReducedMotion() ? undefined : REVEAL;

  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-surface">
      {/* A single faint wash, so the closing band reads as its own surface
          rather than a flat slab. Nothing else is decorated. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(44rem_14rem_at_50%_-6rem,var(--neon-glow),transparent_72%)]"
      />

      <Container className="relative py-12 sm:py-14 lg:py-16">
        <motion.div variants={STAGGER} {...reveal}>
          {/* Brand: identity, one sentence, one action. */}
          <motion.div
            variants={FADE_UP}
            className="flex flex-col gap-7 border-b border-border pb-10 md:flex-row md:items-end md:justify-between md:gap-12 lg:pb-12"
          >
            <div className="min-w-0">
              <BrandLogo />
              <p className="mt-5 max-w-md text-pretty text-base leading-8 text-text-secondary">
                {t("footer.tagline")}
              </p>
            </div>

            <Button
              as={Link}
              to={PROJECT_PATH}
              size="md"
              className="w-full justify-center rounded-xl px-6 sm:w-auto md:shrink-0"
            >
              {t("common.startProject")}
              <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>
          </motion.div>

          {/* Navigation: four groups, in the order a visitor reads them. */}
          <div
            className={`grid min-w-0 grid-cols-1 gap-x-8 gap-y-10 pt-10 sm:grid-cols-2 lg:gap-x-12 lg:pt-12 ${COLUMNS_CLASS}`}
          >
            <motion.nav
              variants={FADE_UP}
              aria-label={t("footer.quickLinks")}
              className="min-w-0"
            >
              <h2 className={HEADING}>{t("footer.quickLinks")}</h2>
              <ul className="mt-4 grid gap-1">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={LINK_MUTED}>
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.nav
              variants={FADE_UP}
              aria-label={t("common.services")}
              className="min-w-0"
            >
              <h2 className={HEADING}>{t("common.services")}</h2>
              <ul className="mt-4 grid gap-1">
                {SERVICE_GROUPS.map(({ category, featured }) => (
                  <li key={category.id}>
                    <Link
                      to={`/services?category=${encodeURIComponent(category.slug)}`}
                      className={LINK_STRONG}
                    >
                      {t(category.titleKey)}
                    </Link>
                    {featured && (
                      <ul className="ps-3">
                        <li>
                          <Link to={`/services/${featured.slug}`} className={LINK_SUB}>
                            {t(featured.titleKey)}
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <Link to={SERVICES_PATH} className={LINK_CTA}>
                {t("footer.viewAllServices")}
                <ArrowUpRight aria-hidden="true" size={15} className="rtl:-scale-x-100" />
              </Link>
            </motion.nav>

            {HAS_CONTACT && (
              <motion.section
                variants={FADE_UP}
                aria-labelledby="footer-contact-heading"
                className="min-w-0"
              >
                <h2 id="footer-contact-heading" className={HEADING}>
                  {t("footer.getInTouch")}
                </h2>
                <address className="not-italic">
                  <ul className="mt-3 grid gap-1">
                    {CONTACT_METHODS.map(
                      ({ key, labelKey, value, href, ariaLabelKey, external, Icon }) => (
                        <li key={key}>
                          <a
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            aria-label={
                              ariaLabelKey ? t(ariaLabelKey) : `${t(labelKey)}: ${value}`
                            }
                            className="group inline-flex min-h-11 max-w-full items-center gap-3 rounded-lg text-sm text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            <span className={TILE}>
                              <Icon aria-hidden="true" size={17} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs">{t(labelKey)}</span>
                              <bdi
                                dir="ltr"
                                className="mt-0.5 block break-all text-text-primary transition-colors duration-200 group-hover:text-brand-light motion-reduce:transition-none rtl:text-right"
                              >
                                {value}
                              </bdi>
                            </span>
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </address>
              </motion.section>
            )}

            {HAS_SOCIAL && (
              <motion.section
                variants={FADE_UP}
                aria-labelledby="footer-social-heading"
                className="min-w-0"
              >
                <h2 id="footer-social-heading" className={HEADING}>
                  {t("footer.connectWithUs")}
                </h2>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {t("footer.followUs")}
                </p>
                <ul className="mt-4 flex flex-wrap items-center gap-2">
                  {SOCIAL_LINKS.map(({ id, label, safeUrl, paths }) => (
                    <li key={id}>
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid size-10 place-items-center rounded-xl border border-border bg-surface-raised text-text-secondary outline-offset-2 transition-colors duration-200 hover:border-brand/40 hover:bg-brand/10 hover:text-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon motion-reduce:transition-none"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-[18px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          focusable="false"
                        >
                          {paths.map((d) => (
                            <path key={d} d={d} />
                          ))}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>
        </motion.div>
      </Container>

      {/* Legal: a quieter band, so the footer settles instead of stopping. */}
      <div className="relative border-t border-border bg-background">
        <Container className="py-5 text-xs text-text-secondary">
          <p>
            <bdi dir="ltr">© {COPYRIGHT_YEAR} Helaly.</bdi> {t("footer.rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}

export default memo(Footer);
