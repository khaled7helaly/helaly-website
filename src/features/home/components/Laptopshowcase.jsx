import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  Activity,
  Gauge,
  Layers,
  LayoutDashboard,
  MousePointer2,
  Pen,
  RefreshCw,
  Settings,
  Smartphone,
  Square,
  Type,
  Users,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

/*
  A laptop whose screen shows the three services in turn: Web, UI/UX, Application.
  The tabs are the "usable" part: click one and the preview stays on it.

  Performance:
  - Nothing renders or runs until the laptop is on screen (useInView), and it pauses
    when the pointer is over it or it scrolls away.
  - The auto-advance is not a JS timer: the active tab's thin timer bar is a CSS animation
    (.tab-timer in index.css) and its animationend moves to the next preview.
  - Only one preview is mounted at a time. Reduced motion: no auto-advance, no intro motion.
  - Scales by container query units (tan/atan2), so no resize JS and no layout shift.
*/

const EASE = [0.22, 1, 0.36, 1];
const VIEWS = ["web", "uiux", "app"];
const CYCLE_MS = 5600;

const BRAND_GRADIENT =
  "linear-gradient(145deg, color-mix(in oklab, var(--brand) 78%, white), var(--brand) 45%, var(--brand-deep))";
const BAR_GRADIENT =
  "linear-gradient(to top, var(--brand), color-mix(in oklab, var(--brand) 70%, white))";
const SOFT_BAR = "color-mix(in oklab, var(--brand) 22%, transparent)";
const DOT_GRID =
  "radial-gradient(color-mix(in oklab, var(--text-primary) 16%, transparent) 1px, transparent 1px)";

// Monthly active users: a steady climb, the last bar is the one we point at.
const BARS = [20, 27, 25, 34, 33, 42, 41, 51, 50, 61, 70, 86];

// The "keeps evolving" story: shipped, being tested, planned.
const ROADMAP = [
  { id: "payments", status: "live", progress: 100 },
  { id: "chat", status: "testing", progress: 68 },
  { id: "mobile", status: "planned", progress: 24 },
];

const STATUS_DOT = {
  live: "bg-neon shadow-sm shadow-neon/50",
  testing: "bg-warning",
  planned: "bg-brand-light",
};

const CHIPS = {
  web: { a: Gauge, b: Zap },
  uiux: { a: Layers, b: Type },
  app: { a: Smartphone, b: RefreshCw },
};

// English fallbacks. The same keys (en + ar) are in new-translation-keys.json.
const CHIP_DEFAULTS = {
  "web.a": "Speed score 98",
  "web.b": "Loads in 0.8s",
  "uiux.a": "24 screens designed",
  "uiux.b": "Design system ready",
  "app.a": "iOS and Android",
  "app.b": "Real-time sync",
};

const TAB_DEFAULTS = { web: "Web", uiux: "UI/UX", app: "Apps" };

// These reuse the hero.app.* keys you already added for the old dashboard.
const APP_DEFAULTS = {
  welcome: "Welcome back",
  activeUsers: "Active users",
  usersValue: "48.2K",
  peakValue: "12.4K",
  performance: "Performance",
  roadmap: "Release roadmap",
  "features.payments": "Online payments",
  "features.chat": "Live chat",
  "features.mobile": "Mobile app",
  "status.live": "Live",
  "status.testing": "Testing",
  "status.planned": "Planned",
};

function useAppText() {
  const { t } = useTranslation();
  return (key) => t(`hero.app.${key}`, { defaultValue: APP_DEFAULTS[key] });
}

/*
  Draws a fixed-size design, then scales it to the width of its box.
  tan(atan2(100cqw, W)) turns "container width / W" into the plain number scale() needs.
*/
function Scaled({ width, height, className, style, children, ...rest }) {
  return (
    <motion.div
      className={className}
      style={{ aspectRatio: `${width} / ${height}`, containerType: "inline-size", ...style }}
      {...rest}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(tan(atan2(100cqw, ${width}px)))` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ---------- The laptop (design size 1000 x 610, screen 912 x 552) ---------- */

function Laptop({ children }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[30px] top-0 h-[580px] w-[940px] rounded-b-[8px] rounded-t-[28px] bg-[#0a0f0c] p-[14px] shadow-[0_70px_130px_-50px_var(--brand)] ring-1 ring-white/10">
        <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-surface">
          {children}
        </div>
        <span className="absolute left-1/2 top-[5px] size-1.5 -translate-x-1/2 rounded-full bg-white/20" />
      </div>

      <div
        className="absolute bottom-0 left-0 h-[30px] w-[1000px] rounded-b-[24px] rounded-t-[6px]"
        style={{ backgroundImage: "linear-gradient(to bottom, #3a4540, #171d1a 70%, #0d1210)" }}
      >
        <span className="absolute left-1/2 top-0 h-[9px] w-[170px] -translate-x-1/2 rounded-b-[12px] bg-black/50" />
      </div>

      <span
        className="absolute -bottom-5 left-[6%] h-8 w-[88%]"
        style={{ backgroundImage: "radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)" }}
      />
    </div>
  );
}

/* ---------- Previews ---------- */

function WebView({ live }) {
  const { t } = useTranslation();
  const rise = (i) => ({
    initial: live ? { opacity: 0, y: 16 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.15 + i * 0.09, ease: EASE },
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-surface text-text-primary">
      <div className="flex h-11 items-center gap-2 border-b border-border px-5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2.5 rounded-full bg-border" />
        ))}
        <span className="mx-auto h-6 w-72 rounded-full bg-surface-raised" />
      </div>

      {/* The page slowly scrolls, so it reads as a real site. */}
      <motion.div
        className="px-12 pt-7"
        animate={live ? { y: [0, 0, -150] } : { y: 0 }}
        transition={{ duration: 5, times: [0, 0.3, 1], ease: "easeInOut" }}
      >
        <motion.div {...rise(0)} className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="size-7 rounded-lg bg-brand" />
            <span className="h-3 w-20 rounded-full bg-text-primary/80" />
          </div>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-14 rounded-full bg-border" />
            ))}
          </div>
          <span className="rounded-full bg-brand px-5 py-2 text-[13px] font-bold text-on-brand">
            {t("common.startProject")}
          </span>
        </motion.div>

        <div className="mt-10 grid grid-cols-[1.1fr_1fr] items-center gap-10">
          <div>
            <motion.span {...rise(1)} className="block h-8 w-[92%] rounded-full bg-text-primary" />
            <motion.span {...rise(2)} className="mt-3 block h-8 w-[68%] rounded-full bg-neon" />
            <motion.div {...rise(3)} className="mt-7 space-y-2.5">
              <span className="block h-2.5 w-full rounded-full bg-border" />
              <span className="block h-2.5 w-[88%] rounded-full bg-border" />
              <span className="block h-2.5 w-[60%] rounded-full bg-border" />
            </motion.div>
            <motion.div {...rise(4)} className="mt-8 flex gap-3">
              <span className="h-11 w-36 rounded-full bg-brand" />
              <span className="h-11 w-32 rounded-full border border-border" />
            </motion.div>
          </div>

          <motion.div
            {...rise(3)}
            className="relative h-[270px] overflow-hidden rounded-3xl"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            <span className="absolute -end-12 -top-12 size-48 rounded-full bg-white/20" />
            <span className="absolute -bottom-16 start-10 size-44 rounded-full bg-black/15" />
            <div className="absolute bottom-5 start-5 flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-xl">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-neon-ink">
                <Gauge size={18} />
              </span>
              <span className="space-y-1.5">
                <span className="block h-2.5 w-20 rounded-full bg-text-primary/80" />
                <span className="block h-2 w-14 rounded-full bg-border" />
              </span>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-5">
          {[Gauge, Layers, Smartphone].map((Icon, i) => (
            <div key={i} className="rounded-2xl border border-border p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-neon-ink">
                <Icon size={18} />
              </span>
              <span className="mt-4 block h-3 w-24 rounded-full bg-text-primary/80" />
              <span className="mt-2.5 block h-2.5 w-full rounded-full bg-border" />
              <span className="mt-2 block h-2.5 w-2/3 rounded-full bg-border" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function DesignView({ live }) {
  const { t } = useTranslation();
  const pop = (delay) => ({
    initial: live ? { opacity: 0, scale: 0.94 } : false,
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.55, delay, ease: EASE },
  });

  return (
    // Design tools read left to right in every language.
    <div
      dir="ltr"
      className="absolute inset-0 overflow-hidden bg-surface-raised text-text-primary"
      style={{ backgroundImage: DOT_GRID, backgroundSize: "24px 24px" }}
    >
      <div className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 rounded-2xl border border-border bg-surface p-2 shadow-lg">
        {[MousePointer2, Square, Type, Pen].map((Icon, i) => (
          <span
            key={i}
            className={`grid size-10 place-items-center rounded-xl ${
              i === 0 ? "bg-brand text-on-brand" : "text-text-secondary"
            }`}
          >
            <Icon size={18} />
          </span>
        ))}
      </div>

      <motion.div
        {...pop(0.15)}
        className="absolute left-[104px] top-[60px] h-[340px] w-[460px] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex h-10 items-center gap-2 border-b border-border px-4">
          <span className="size-6 rounded-md bg-brand" />
          <span className="h-2.5 w-20 rounded-full bg-text-primary/70" />
          <span className="ms-auto h-2.5 w-24 rounded-full bg-border" />
        </div>
        <div className="grid grid-cols-[1.2fr_1fr] gap-4 p-5">
          <div className="space-y-3">
            <span className="block h-4 w-[90%] rounded-full bg-text-primary/80" />
            <span className="block h-4 w-[65%] rounded-full bg-text-primary/80" />
            <span className="mt-5 block h-2.5 w-full rounded-full bg-border" />
            <span className="block h-2.5 w-[80%] rounded-full bg-border" />
            <span className="mt-5 block h-8 w-28 rounded-full bg-brand" />
          </div>
          <div className="h-36 rounded-xl" style={{ backgroundImage: BRAND_GRADIENT }} />
        </div>
        <div className="grid grid-cols-3 gap-3 px-5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-16 rounded-xl border border-border bg-surface-raised" />
          ))}
        </div>
      </motion.div>

      <motion.div
        {...pop(0.3)}
        className="absolute left-[598px] top-[104px] h-[372px] w-[172px] rounded-[28px] border border-border bg-surface p-3 shadow-xl"
      >
        <span className="mx-auto block h-1.5 w-14 rounded-full bg-border" />
        <span className="mt-4 block h-20 rounded-2xl" style={{ backgroundImage: BRAND_GRADIENT }} />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="mt-3 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-surface-raised" />
            <span className="h-2.5 flex-1 rounded-full bg-border" />
          </span>
        ))}

        {/* selection */}
        <span className="pointer-events-none absolute -inset-2.5 rounded-[34px] border-2 border-brand" />
        {["-left-3.5 -top-3.5", "-right-3.5 -top-3.5", "-bottom-3.5 -left-3.5", "-bottom-3.5 -right-3.5"].map(
          (position) => (
            <span
              key={position}
              className={`absolute size-2.5 rounded-sm border-2 border-brand bg-surface ${position}`}
            />
          ),
        )}
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-md bg-brand px-2 py-1 text-[11px] font-bold text-on-brand">
          390 × 844
        </span>
      </motion.div>

      <motion.div
        className="absolute left-[596px] top-[330px]"
        initial={live ? { x: -240, y: -150, opacity: 0 } : false}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
      >
        <MousePointer2 size={24} className="fill-text-primary text-background" />
        <span className="-mt-1 ms-5 inline-block rounded-md rounded-ss-none bg-brand px-2 py-1 text-[11px] font-bold text-on-brand">
          {t("launch.tabs.uiux", { defaultValue: TAB_DEFAULTS.uiux })}
        </span>
      </motion.div>

      <div className="absolute right-5 top-6 w-[116px] rounded-2xl border border-border bg-surface p-3 shadow-lg">
        <p className="text-3xl font-extrabold leading-none">Aa</p>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {["bg-brand", "bg-brand-deep", "bg-text-primary", "bg-border"].map((tone) => (
            <span key={tone} className={`aspect-square rounded-md ${tone}`} />
          ))}
        </div>
        <span className="mt-3 block h-2 w-full rounded-full bg-border" />
        <span className="mt-2 block h-2 w-2/3 rounded-full bg-border" />
      </div>
    </div>
  );
}

function AppView({ live }) {
  const text = useAppText();
  const last = BARS.length - 1;

  return (
    <div className="absolute inset-0 flex bg-surface text-text-primary">
      <div className="flex w-[76px] shrink-0 flex-col items-center gap-3 border-e border-border py-6">
        <span className="mb-3 grid size-10 place-items-center rounded-xl bg-brand text-on-brand">
          <Zap size={18} />
        </span>
        {[LayoutDashboard, Users, Activity, Settings].map((Icon, i) => (
          <span
            key={i}
            className={`grid size-10 place-items-center rounded-xl ${
              i === 0 ? "bg-brand/15 text-neon-ink" : "text-text-secondary"
            }`}
          >
            <Icon size={18} />
          </span>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-7">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-bold leading-tight">{text("welcome")}</p>
          <span className="size-10 rounded-full" style={{ backgroundImage: BRAND_GRADIENT }} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-5">
          <div className="flex flex-col rounded-2xl border border-border p-5">
            <p className="text-[14px] font-semibold">{text("activeUsers")}</p>
            <div className="mt-3 flex items-center gap-2.5">
              <span className="text-[34px] font-bold leading-none tracking-tight">
                {text("usersValue")}
              </span>
              <span className="rounded-md bg-neon/15 px-2 py-1 text-xs font-bold leading-none text-neon-ink">
                +18.2%
              </span>
            </div>

            {/* Time always reads left to right, in Arabic too. */}
            <div dir="ltr" className="relative mt-auto h-[236px]">
              <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col justify-between">
                {[0, 1, 2, 3].map((line) => (
                  <span key={line} className="border-t border-dashed border-border" />
                ))}
              </div>

              <div className="absolute inset-0 flex items-end gap-2.5">
                {BARS.map((value, i) => {
                  const hot = i === last;
                  return (
                    <div key={i} className="relative flex h-full flex-1 items-end">
                      <motion.div
                        className="w-full origin-bottom rounded-t-lg"
                        style={{ height: `${value}%`, background: hot ? BAR_GRADIENT : SOFT_BAR }}
                        initial={live ? { scaleY: 0 } : false}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.045, ease: EASE }}
                      />

                      {hot && (
                        <div
                          className="absolute inset-x-0 flex justify-center"
                          style={{ bottom: `calc(${value}% + 10px)` }}
                        >
                          <motion.span
                            className="relative rounded-lg bg-text-primary px-3 py-1.5 text-xs font-bold leading-none text-background"
                            initial={live ? { opacity: 0, y: 8 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2, ease: EASE }}
                          >
                            {text("peakValue")}
                            <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[2px] bg-text-primary" />
                          </motion.span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-5">
            <div className="flex items-center gap-4 rounded-2xl border border-border p-5">
              <div className="relative size-[96px] shrink-0">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90" focusable="false">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--brand)"
                    strokeOpacity="0.2"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={live ? { pathLength: 0 } : false}
                    animate={{ pathLength: 0.98 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[24px] font-bold">
                  98
                </span>
              </div>
              <p className="text-[14px] font-semibold">{text("performance")}</p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border p-5">
              <p className="text-[14px] font-semibold">{text("roadmap")}</p>
              <div className="mt-4 flex flex-1 flex-col justify-between">
                {ROADMAP.map(({ id, status, progress }, i) => (
                  <div key={id}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-semibold">{text(`features.${id}`)}</span>
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} />
                        {text(`status.${status}`)}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full"
                      style={{ backgroundColor: SOFT_BAR }}
                    >
                      <motion.div
                        className="h-full origin-left rounded-full bg-brand rtl:origin-right"
                        style={{ width: `${progress}%` }}
                        initial={live ? { scaleX: 0 } : false}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREENS = { web: WebView, uiux: DesignView, app: AppView };

/* ---------- Floating side chips: they change with the preview ---------- */

function FloatingChip({ Icon, label, className, delay, live }) {
  return (
    <motion.div
      className={`flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-text-primary shadow-xl shadow-black/20 ${className}`}
      initial={live ? { opacity: 0, y: 14, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25, delay: 0 } }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-brand/15 text-neon-ink">
        <Icon aria-hidden="true" size={16} />
      </span>
      {label}
    </motion.div>
  );
}

/* ---------- Showcase ---------- */

function LaptopShowcase({ className = "" }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const live = !prefersReducedMotion;
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });

  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [auto, setAuto] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  const view = VIEWS[index];
  const Screen = SCREENS[view];
  const running = auto && live && inView && !hovered;

  const chipLabel = (slot) =>
    t(`launch.chips.${view}.${slot}`, { defaultValue: CHIP_DEFAULTS[`${view}.${slot}`] });

  const pillTransition = live
    ? { type: "spring", stiffness: 420, damping: 34 }
    : { duration: 0 };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="relative mx-auto w-full max-w-[50rem]">
        <div
          aria-hidden="true"
          className="hero-art-halo absolute inset-x-[4%] inset-y-[8%]"
        />

        <Scaled
          width={1000}
          height={610}
          aria-hidden="true"
          className="relative w-full [transform:perspective(1800px)_rotateY(-11deg)_rotateX(3deg)] rtl:[transform:perspective(1800px)_rotateY(11deg)_rotateX(3deg)]"
        >
          <Laptop>
            <AnimatePresence>
              {started && (
                <motion.div
                  key={view}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: live ? 0.5 : 0 }}
                >
                  <Screen live={live} />
                </motion.div>
              )}
            </AnimatePresence>
          </Laptop>
        </Scaled>

        <AnimatePresence>
          {started && (
            <FloatingChip
              key={`${view}-a`}
              Icon={CHIPS[view].a}
              label={chipLabel("a")}
              className="absolute -top-3 end-0 sm:-end-6"
              delay={0.35}
              live={live}
            />
          )}
          {started && (
            <FloatingChip
              key={`${view}-b`}
              Icon={CHIPS[view].b}
              label={chipLabel("b")}
              className="absolute bottom-24 start-0 sm:-start-8"
              delay={0.5}
              live={live}
            />
          )}
        </AnimatePresence>
      </div>

      <div
        role="group"
        aria-label={t("launch.tabsLabel", { defaultValue: "Choose a service preview" })}
        className="mx-auto mt-10 flex w-fit items-center gap-1 rounded-full border border-border bg-surface p-1.5 shadow-sm"
      >
        {VIEWS.map((id, i) => {
          const active = i === index;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setIndex(i);
                setAuto(false);
              }}
              className={`relative flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                active ? "text-background" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="launch-tab"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-text-primary"
                  transition={pillTransition}
                />
              )}
              <span className="relative">
                {t(`launch.tabs.${id}`, { defaultValue: TAB_DEFAULTS[id] })}
              </span>

              {active && auto && live && (
                <span
                  key={index}
                  aria-hidden="true"
                  onAnimationEnd={() => setIndex((current) => (current + 1) % VIEWS.length)}
                  className="tab-timer absolute inset-x-5 bottom-1.5 h-0.5 rounded-full bg-brand"
                  style={{
                    animationDuration: `${CYCLE_MS}ms`,
                    animationPlayState: running ? "running" : "paused",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LaptopShowcase;