import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";

/*
  A quiet band that says what we build. The loop is pure CSS (.marquee-track in index.css):
  transform only, so it runs on the compositor. It pauses on hover/focus and is off for
  reduced motion. The second copy of the list is aria-hidden so screen readers read it once.
*/

const SERVICES_PATH = "/services";

const ITEMS = {
  websites: "Websites",
  webApps: "Web apps",
  uiux: "UI/UX design",
  mobile: "Mobile apps",
  ecommerce: "E-commerce",
  dashboards: "Dashboards",
  designSystems: "Design systems",
  seo: "SEO and speed",
};

function Group({ items, hidden = false }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pe-10"
    >
      {items.map((label) => (
        <li
          key={label}
          className="flex items-center gap-10 whitespace-nowrap text-lg font-semibold text-text-primary/80"
        >
          {label}
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-brand" />
        </li>
      ))}
    </ul>
  );
}

function MarqueeStrip() {
  const { t } = useTranslation();
  const items = Object.keys(ITEMS).map((id) =>
    t(`strip.items.${id}`, { defaultValue: ITEMS[id] }),
  );

  return (
    <div className="relative border-t border-border bg-surface">
      <Container className="flex items-center gap-6 py-5">
        <p className="hidden shrink-0 text-sm font-semibold text-text-secondary md:block">
          {t("strip.label", { defaultValue: "What we build" })}
        </p>
        <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-border md:block" />

        <div className="marquee relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track flex w-max">
            <Group items={items} />
            <Group items={items} hidden />
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16"
            style={{ backgroundImage: "linear-gradient(to right, var(--surface), transparent)" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16"
            style={{ backgroundImage: "linear-gradient(to left, var(--surface), transparent)" }}
          />
        </div>

        <Button
          as={Link}
          to={SERVICES_PATH}
          variant="outline"
          size="sm"
          className="hidden shrink-0 rounded-full px-5 md:inline-flex"
        >
          {t("hero.cta", { defaultValue: "Browse services" })}
          <ArrowUpRight aria-hidden="true" size={16} className="rtl:-scale-x-100" />
        </Button>
      </Container>
    </div>
  );
}

export default MarqueeStrip;