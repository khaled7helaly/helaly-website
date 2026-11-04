import { useId, useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Globe,
  MousePointer2,
  PenTool,
  Smartphone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

/*
  The first choice a visitor makes: Web, UI/UX or Application.

  Self-contained: own data, own previews, own copy keys, own motion.
  HeroSection only renders <HeroServiceCards />.

  Calm by default: nothing is lit at rest. On hover or keyboard focus a card turns silver and one
  soft glint glides across it. Lighting a card fades a single overlay and moves one transformed
  layer, so it stays cheap, and prefers-reduced-motion removes the glint.
*/

const EASE = [0.22, 1, 0.36, 1];

// Change these if your services route is different. Hashes are harmless if the page has no anchors.
const SERVICES_PATH = "/services";

// Silver is light in both themes, so the text on it is a fixed dark ink (#1a2029), not a theme token.
const SILVER_STYLE = {
  backgroundImage:
    "linear-gradient(150deg, #f1f3f6 0%, #dfe3e8 38%, #c9cfd7 66%, #e2e6eb 100%)",
};

// The glint: faint wide edges and a brighter core, so it reads as light rather than as a stripe.
// The glide is slow and the fade is quick, so on mouse-out it dissolves instead of sweeping back.
// Tailwind v4 moves things with the `translate` property (v3 used `transform`), so both are listed.
const SHEEN_STYLE = {
  backgroundImage:
    "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.2) 30%, rgb(255 255 255 / 0.8) 50%, rgb(255 255 255 / 0.2) 70%, transparent 100%)",
  transition:
    "transform 1200ms cubic-bezier(0.4, 0, 0.2, 1), translate 1200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease-out",
};

// Preview accents cross-fade together with the card instead of snapping.
const FADE = "transition-colors duration-500 motion-reduce:transition-none";

// English fallbacks. The same keys (en + ar) are in new-translation-keys.json.
const DEFAULTS = {
  label: "What do you want to build?",
  "web.title": "Web development",
  "web.description":
    "Fast, search-ready websites and platforms that turn visitors into customers.",
  "web.tagA": "Websites",
  "web.tagB": "E-commerce",
  "uiux.title": "UI/UX design",
  "uiux.description":
    "Clear interfaces and experiences, shaped by real users and ready for development.",
  "uiux.tagA": "Product design",
  "uiux.tagB": "Design systems",
  "app.title": "Application development",
  "app.description":
    "Reliable web and mobile apps that grow with your product and run smoothly everywhere.",
  "app.tagA": "Web apps",
  "app.tagB": "Mobile apps",
};

/* ---------- Tiny previews: they draw with currentColor, so they follow the card's text colour ---------- */

function WebArt({ lit }) {
  return (
    <div className="h-full rounded-xl border border-current/15 bg-current/[0.05] p-3">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-1.5 rounded-full bg-current/30" />
        ))}
        <span className="ms-2 h-1.5 w-16 rounded-full bg-current/15" />
      </div>

      <div className="mt-3 grid grid-cols-[1.3fr_1fr] gap-3">
        <div className="space-y-1.5">
          <span className="block h-2 w-[85%] rounded-full bg-current/35" />
          <span className="block h-2 w-[60%] rounded-full bg-current/35" />
          <span
            className={`mt-2.5 block h-4 w-14 rounded-full ${FADE} ${lit ? "bg-current" : "bg-brand"}`}
          />
        </div>
        <div className="h-12 rounded-lg bg-current/15" />
      </div>
    </div>
  );
}

function DesignArt({ lit }) {
  const fill = lit ? "bg-current" : "bg-brand";
  const line = lit ? "border-current" : "border-brand";

  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-current/15 bg-current/[0.05]">
      <span className="absolute start-4 top-4 h-11 w-[4.5rem] rounded-lg border border-current/25 bg-current/10" />
      <span className="absolute start-14 top-7 h-12 w-20 rounded-lg border border-current/40 bg-current/15" />

      <span
        className={`absolute start-[3.25rem] top-6 h-14 w-[5.75rem] rounded-md border-2 ${FADE} ${line}`}
      >
        <span
          className={`absolute -start-1 -top-1 size-2 rounded-[2px] ${FADE} ${fill}`}
        />
        <span
          className={`absolute -bottom-1 -end-1 size-2 rounded-[2px] ${FADE} ${fill}`}
        />
      </span>

      <span className="absolute end-3 top-3 flex gap-1">
        <span className={`size-3 rounded-full ${FADE} ${fill}`} />
        <span className="size-3 rounded-full bg-current/50" />
        <span className="size-3 rounded-full bg-current/25" />
      </span>

      <MousePointer2
        aria-hidden="true"
        size={18}
        className="absolute bottom-3 end-8 fill-current"
      />
    </div>
  );
}

function AppArt({ lit }) {
  const fill = lit ? "bg-current" : "bg-brand";
  const bars = [38, 62, 48, 82, 58];

  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-current/15 bg-current/[0.05]">
      <span className="absolute start-6 top-6 h-12 w-24 rounded-md border border-current/30 bg-current/10" />
      <span className="absolute start-4 top-[4.4rem] h-1 w-28 rounded-full bg-current/25" />

      <span className="absolute end-10 top-2 block h-20 w-14 rounded-[0.9rem] border-2 border-current/45 p-1.5">
        <span className="mx-auto block h-1 w-5 rounded-full bg-current/30" />
        <span className="mt-2 flex h-8 items-end gap-1">
          {bars.map((height, i) => (
            <span
              key={i}
              className={`flex-1 rounded-sm ${FADE} ${i === 3 ? fill : "bg-current/30"}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}

const CHOICES = [
  { id: "web", to: `${SERVICES_PATH}#web`, Icon: Globe, Art: WebArt },
  { id: "uiux", to: `${SERVICES_PATH}#ui-ux`, Icon: PenTool, Art: DesignArt },
  { id: "app", to: `${SERVICES_PATH}#applications`, Icon: Smartphone, Art: AppArt },
];

/* ---------- One card. It owns its own hover/focus state, so lighting one card re-renders only that card ---------- */

function ChoiceCard({ id, to, Icon, Art, text }) {
  const uid = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isLit = hovered || focused;

  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;

  return (
    <Link
      to={to}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      // Keyboard focus lights the card; a mouse click's focus does not leave it stuck lit.
      onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-surface p-6 outline-offset-4 transition-[translate,color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none ${
        isLit
          ? "-translate-y-0.5 border-[#ffffff99] text-[#1a2029] shadow-[0_26px_60px_-38px_rgb(150_160_175/0.8)] motion-reduce:translate-y-0"
          : "border-border text-text-primary"
      }`}
    >
      {/* Silver surface: only its opacity changes. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          isLit ? "opacity-100" : "opacity-0"
        }`}
        style={SILVER_STYLE}
      />

      {/* Glint: one skewed band that glides across once, then rests off-card. Mirrors in RTL. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 start-0 w-1/3 -skew-x-12 motion-reduce:hidden rtl:skew-x-12 ${
          isLit
            ? "translate-x-[335%] opacity-100 rtl:-translate-x-[335%]"
            : "-translate-x-[125%] opacity-0 rtl:translate-x-[125%]"
        }`}
        style={SHEEN_STYLE}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`grid size-11 place-items-center rounded-xl ring-1 transition-[color,background-color,box-shadow] duration-500 motion-reduce:transition-none ${
            isLit
              ? "bg-[#ffffff99] text-[#1a2029] ring-[#1a2029]/10"
              : "bg-brand/12 text-neon-ink ring-brand/20"
          }`}
        >
          <Icon aria-hidden="true" size={20} />
        </span>

        <span
          className={`grid size-9 place-items-center rounded-full border transition-[color,background-color,border-color] duration-500 motion-reduce:transition-none ${
            isLit
              ? "border-transparent bg-[#1a2029] text-[#f8fafc]"
              : "border-border text-text-secondary"
          }`}
        >
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            className={`transition-transform duration-500 rtl:-scale-x-100 motion-reduce:transition-none ${
              isLit ? "-translate-y-0.5 translate-x-0.5 rtl:-translate-x-0.5" : ""
            }`}
          />
        </span>
      </div>

      <div aria-hidden="true" className="relative mt-5 h-24">
        <Art lit={isLit} />
      </div>

      <h3
        id={titleId}
        className="relative mt-6 text-xl font-bold tracking-tight rtl:tracking-normal"
      >
        {text(`${id}.title`)}
      </h3>

      <p
        id={descriptionId}
        className={`relative mt-2 text-sm leading-6 transition-colors duration-500 motion-reduce:transition-none ${
          isLit ? "text-[#1a2029]/75" : "text-text-secondary"
        }`}
      >
        {text(`${id}.description`)}
      </p>

      <div className="relative mt-auto pt-6">
        <div className="flex flex-wrap gap-2 border-t border-current/15 pt-4">
          {["tagA", "tagB"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-current/20 px-3 py-1 text-xs font-semibold"
            >
              {text(`${id}.${tag}`)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function HeroServiceCards({ className = "" }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const live = !prefersReducedMotion;

  const text = (key) => t(`hero.chooser.${key}`, { defaultValue: DEFAULTS[key] });

  return (
    <div className={className}>
      <div className="mb-5 flex items-center gap-4">
        <p className="text-sm font-semibold text-text-secondary">{text("label")}</p>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {CHOICES.map((choice, index) => (
          <motion.li
            key={choice.id}
            className="h-full"
            initial={live ? { opacity: 0, y: 28 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 + index * 0.1, ease: EASE }}
          >
            <ChoiceCard {...choice} text={text} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default HeroServiceCards;