import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CalendarCheck, Layers, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { PROJECT_PATH } from "../../../components/layout/navigation";
import LaptopShowcase from "./Laptopshowcase";
import MarqueeStrip from "./Marqueestrip";

/*
  The old dashboard hero, turned into a section.
  Structure, in reading order:
    1. what we do (one sentence + three short proofs)
    2. three actions: Start your project, Browse projects, Browse services
    3. the laptop on the other side, showing the three services in turn
    4. a full-width strip underneath

  Usable first: the actions are real buttons and links, the preview is decorative.
*/

const EASE = [0.22, 1, 0.36, 1];
const SERVICES_PATH = "/services";
const WORK_PATH = "/work";

const POINTS = [
  { id: "team", Icon: Layers },
  { id: "plan", Icon: CalendarCheck },
  { id: "scale", Icon: TrendingUp },
];

// English fallbacks. The same keys (en + ar) are in new-translation-keys.json.
const DEFAULTS = {
  title: "From first sketch to live product, in one place.",
  description:
    "Tell us what you need. We shape the idea, design the experience, build it, and keep improving it after launch.",
  "points.team.title": "One team, design to code",
  "points.team.description":
    "Strategy, UI/UX and engineering together, so nothing gets lost in handoff.",
  "points.plan.title": "A clear plan",
  "points.plan.description":
    "Weekly updates and visible milestones, so you always know what ships next.",
  "points.scale.title": "Built to scale",
  "points.scale.description": "Fast, secure foundations that keep improving after launch.",
};

function LaunchSection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const live = !prefersReducedMotion;

  const text = (key) => t(`launch.${key}`, { defaultValue: DEFAULTS[key] });

  const reveal = (delay = 0) => ({
    initial: live ? { opacity: 0, y: 24 } : false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      aria-labelledby="launch-title"
      className="relative isolate overflow-hidden border-b border-border bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(46rem 28rem at 78% 55%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative z-[1] py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div>
            <motion.h2
              id="launch-title"
              {...reveal()}
              className="text-heading-lg font-bold leading-[1.1] tracking-[-0.035em] text-text-primary rtl:leading-[1.35] rtl:tracking-normal"
            >
              {text("title")}
            </motion.h2>

            <motion.p
              {...reveal(0.08)}
              className="mt-5 max-w-xl text-base leading-8 text-text-secondary sm:text-lg"
            >
              {text("description")}
            </motion.p>

            <motion.ul {...reveal(0.16)} className="mt-9 grid gap-5">
              {POINTS.map(({ id, Icon }) => (
                <li key={id} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand/12 text-neon-ink ring-1 ring-brand/20">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-text-primary">{text(`points.${id}.title`)}</p>
                    <p className="mt-0.5 text-sm leading-6 text-text-secondary">
                      {text(`points.${id}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>

            <motion.div {...reveal(0.24)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button as={Link} to={PROJECT_PATH} className="min-h-12 rounded-full px-7">
                {t("common.startProject")}
                <ArrowUpRight aria-hidden="true" size={18} className="rtl:-scale-x-100" />
              </Button>

              <Button
                as={Link}
                to={WORK_PATH}
                variant="outline"
                className="min-h-12 rounded-full px-7"
              >
                {t("hero.exploreWork")}
              </Button>

              <Link
                to={SERVICES_PATH}
                className="inline-flex min-h-12 items-center gap-1.5 px-2 text-sm font-semibold text-neon-ink underline-offset-4 hover:underline"
              >
                {t("hero.cta", { defaultValue: "Browse services" })}
                <ArrowUpRight aria-hidden="true" size={16} className="rtl:-scale-x-100" />
              </Link>
            </motion.div>
          </div>

          <LaptopShowcase />
        </div>
      </Container>

      <MarqueeStrip />
    </section>
  );
}

export default LaunchSection;