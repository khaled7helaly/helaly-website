import { useEffect, useId, useRef, useState } from "react";
import { Accessibility, Gauge, Layers, MessagesSquare } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";

/* -------------------------------------------------------------------------- */
/*  THE IDEA                                                                  */
/*  One pen stroke draws itself across the section. Each value hangs from it  */
/*  on its own thin line, and its text is "written" the moment the pen        */
/*  reaches it. No cards, no image grid: just the line and the words.         */
/*                                                                            */
/*  xl and up : the stroke runs across, four lines drop from it.              */
/*  below xl  : the stroke runs down the side, each value branches off it.    */
/* -------------------------------------------------------------------------- */

// Optional: ONE cinematic photo behind the whole section (kept dark and subtle).
// Leave it "" for a clean background.
const BACKDROP_IMAGE = "";

// How long the pen takes to cross the section (xl and up), in seconds.
const PEN_SECONDS = 2.8;

const EASE = [0.22, 1, 0.36, 1];

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

/* -------------------------------------------------------------------------- */
/*  Pen geometry. viewBox is 1200 x 160 and the list below it is 4 equal      */
/*  columns, so a drop at x = 0 / 300 / 600 / 900 lands on each column start. */
/*  `at` = how far along the stroke (0..1) the pen is when it reaches it.     */
/* -------------------------------------------------------------------------- */
const TRUNK =
  "M0 52 C150 52 150 100 300 100 C450 100 450 52 600 52 C750 52 750 100 900 100 C1030 100 1100 80 1200 62";

// A thinner second stroke that trails the first, like a pencil sketch under ink.
const ECHO =
  "M0 78 C60 78 100 62 160 62 C280 62 280 92 400 92 C520 92 520 62 640 62 C760 62 760 92 880 92 C1000 92 1060 78 1200 68";

const BASE_Y = 156;

const ANCHORS = [
  { x: 0, y: 52, at: 0 },
  { x: 300, y: 100, at: 0.25 },
  { x: 600, y: 52, at: 0.5 },
  { x: 900, y: 100, at: 0.75 },
];

const dropPath = ({ x, y }) => {
  const length = BASE_Y - y;
  return `M${x} ${y} C${x + 8} ${y + length * 0.35} ${x - 8} ${y + length * 0.7} ${x} ${BASE_Y}`;
};

/* -------------------------------------------------------------------------- */
/*  Small animation helpers                                                   */
/* -------------------------------------------------------------------------- */
const write = (show, delay, instant) => ({
  initial: { opacity: 0, y: 12 },
  animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
  transition: {
    duration: instant ? 0 : 0.55,
    delay: show && !instant ? delay : 0,
    ease: EASE,
  },
});

// Titles are wiped in along the reading direction, like ink being laid down.
const wipe = (show, delay, instant, isRtl) => {
  const hidden = isRtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  return {
    initial: { clipPath: hidden },
    animate: { clipPath: show ? "inset(0 0 0 0)" : hidden },
    transition: {
      duration: instant ? 0 : 0.7,
      delay: show && !instant ? delay : 0,
      ease: EASE,
    },
  };
};

const POP_ORIGIN = { transformBox: "fill-box", transformOrigin: "center" };

// Must match Tailwind's `xl` breakpoint.
function useLayoutMode() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => setMode(query.matches ? "line" : "rail");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return mode;
}

/* -------------------------------------------------------------------------- */
/*  xl and up: the big stroke with four drops                                 */
/* -------------------------------------------------------------------------- */
function Branch({ anchor, show, active, instant }) {
  return (
    <g>
      <motion.path
        d={dropPath(anchor)}
        fill="none"
        strokeLinecap="round"
        className="stroke-brand-light"
        initial={{ pathLength: 0, opacity: 0, strokeWidth: 2 }}
        animate={{
          pathLength: show ? 1 : 0,
          opacity: show ? 1 : 0,
          strokeWidth: active ? 3.5 : 2,
        }}
        transition={{
          pathLength: { duration: instant ? 0 : 0.7, ease: EASE },
          opacity: { duration: 0.05 },
          strokeWidth: { duration: 0.25 },
        }}
      />

      <motion.g
        style={POP_ORIGIN}
        initial={{ scale: 0, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{
          duration: instant ? 0 : 0.4,
          delay: show && !instant ? 0.55 : 0,
          ease: EASE,
        }}
      >
        <motion.circle
          cx={anchor.x}
          cy={BASE_Y}
          r="11"
          fill="none"
          strokeWidth="1.5"
          className="stroke-brand"
          style={POP_ORIGIN}
          animate={{ scale: active ? 1.5 : 1, opacity: active ? 0.9 : 0.45 }}
          transition={{ duration: 0.25 }}
        />
        <circle cx={anchor.x} cy={BASE_Y} r="5" className="fill-neon" />
      </motion.g>
    </g>
  );
}

function PenLine({ progress, reached, active, instant }) {
  const gradientId = useId().replace(/:/g, "");
  const trunkRef = useRef(null);
  const tipRef = useRef(null);

  const trunkOpacity = useTransform(progress, [0, 0.004], [0, 1]);
  const echoProgress = useTransform(progress, (value) => Math.max(0, value - 0.06));
  const echoOpacity = useTransform(echoProgress, [0, 0.004], [0, 0.4]);
  const tipOpacity = useTransform(progress, [0, 0.02, 0.96, 1], [0, 1, 1, 0]);

  // The glowing pen tip rides the leading edge of the stroke.
  useMotionValueEvent(progress, "change", (value) => {
    const path = trunkRef.current;
    const tip = tipRef.current;
    if (!path || !tip) return;
    try {
      const point = path.getPointAtLength(value * path.getTotalLength());
      tip.setAttribute("transform", `translate(${point.x} ${point.y})`);
    } catch {
      // The svg is display:none below xl, so there is nothing to measure.
    }
  });

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 160"
      className="hidden h-auto w-full overflow-visible xl:block rtl:-scale-x-100"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1200"
          y2="0"
        >
          <stop offset="0" className="text-brand" style={{ stopColor: "currentColor", stopOpacity: 0.4 }} />
          <stop offset="0.55" className="text-brand-light" style={{ stopColor: "currentColor" }} />
          <stop offset="1" className="text-neon" style={{ stopColor: "currentColor" }} />
        </linearGradient>
      </defs>

      <motion.path
        d={ECHO}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: echoProgress, opacity: echoOpacity }}
      />

      <motion.path
        ref={trunkRef}
        d={TRUNK}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength: progress, opacity: trunkOpacity }}
      />

      {ANCHORS.map((anchor, index) => (
        <Branch
          key={anchor.x}
          anchor={anchor}
          show={reached > index}
          active={active === index}
          instant={instant}
        />
      ))}

      <motion.g style={{ opacity: tipOpacity }}>
        <g ref={tipRef}>
          <circle r="18" className="fill-neon/10" />
          <circle r="8" className="fill-neon/30" />
          <circle r="3.5" className="fill-neon" />
        </g>
      </motion.g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Below xl: the stroke runs down the side, one segment per value            */
/* -------------------------------------------------------------------------- */
function RailTrunk({ show, instant }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 32 100"
      preserveAspectRatio="none"
      className="absolute start-0 top-0 h-full w-8 overflow-visible xl:hidden"
    >
      <motion.path
        d="M16 0 C10 30 22 70 16 100"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-brand-light/60"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: instant ? 0 : 1, ease: EASE },
          opacity: { duration: 0.05 },
        }}
      />
    </svg>
  );
}

function RailNode({ show, instant }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 40"
      className="absolute start-0 top-0 h-10 w-16 overflow-visible xl:hidden rtl:-scale-x-100"
    >
      <motion.g
        style={POP_ORIGIN}
        initial={{ scale: 0, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{
          duration: instant ? 0 : 0.4,
          delay: show && !instant ? 0.2 : 0,
          ease: EASE,
        }}
      >
        <circle cx="16" cy="20" r="11" fill="none" strokeWidth="1.5" className="stroke-brand/50" />
        <circle cx="16" cy="20" r="4.5" className="fill-neon" />
      </motion.g>

      <motion.path
        d="M30 20 H54"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-brand-light/70"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: instant ? 0 : 0.4, delay: show && !instant ? 0.35 : 0, ease: EASE },
          opacity: { duration: 0.05 },
        }}
      />
    </svg>
  );
}

// xl and up: the thin line each value hangs on, continuing the drop above it.
function Pole({ show, instant }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute start-0 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-brand-light/80 to-transparent xl:block"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: show ? 1 : 0 }}
      transition={{
        duration: instant ? 0 : 0.9,
        delay: show && !instant ? 0.3 : 0,
        ease: EASE,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  One value                                                                 */
/* -------------------------------------------------------------------------- */
function ValueItem({ point, index, mode, reached, reduced, isRtl, onActivate }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const { icon: Icon, titleKey, descriptionKey } = point;

  const instant = Boolean(reduced);
  const visible = instant || (mode === "line" ? reached > index : mode === "rail" && seen);

  return (
    <li
      ref={ref}
      onPointerEnter={() => onActivate(index)}
      onPointerLeave={() => onActivate(-1)}
      className="group relative min-w-0 pb-12 ps-16 last:pb-0 xl:pb-0 xl:pe-8 xl:ps-6"
    >
      <RailTrunk show={visible} instant={instant} />
      <RailNode show={visible} instant={instant} />
      <Pole show={visible} instant={instant} />

      <motion.span
        {...write(visible, 0.35, instant)}
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-brand-light transition-colors group-hover:border-brand"
      >
        <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
      </motion.span>

      <motion.h3
        {...wipe(visible, 0.5, instant, isRtl)}
        className="mt-5 block w-fit text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-brand-light"
      >
        {t(titleKey)}
      </motion.h3>

      <motion.p
        {...write(visible, 0.7, instant)}
        className="mt-3 text-sm leading-7 text-text-secondary"
      >
        {t(descriptionKey)}
      </motion.p>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  The line + the four values                                                */
/* -------------------------------------------------------------------------- */
function ValuesBoard({ isRtl }) {
  const reduced = useReducedMotion();
  const mode = useLayoutMode();
  const boardRef = useRef(null);
  const boardInView = useInView(boardRef, { once: true, amount: 0.4 });

  const progress = useMotionValue(0);
  const lastReached = useRef(0);
  const [reached, setReached] = useState(0);
  const [active, setActive] = useState(-1);

  // How many drops the pen has reached so far.
  useMotionValueEvent(progress, "change", (value) => {
    const count = ANCHORS.filter((anchor) => value >= anchor.at).length;
    if (count !== lastReached.current) {
      lastReached.current = count;
      setReached(count);
    }
  });

  // One orchestrated moment: the pen crosses the section once, when it is seen.
  useEffect(() => {
    if (mode !== "line" || !boardInView) return undefined;

    if (reduced) {
      progress.set(1);
      return undefined;
    }

    const controls = animate(progress, 1, { duration: PEN_SECONDS, ease: "easeInOut" });
    return () => controls.stop();
  }, [mode, boardInView, reduced, progress]);

  return (
    <div ref={boardRef} className="mt-14 sm:mt-16 xl:mt-20">
      <PenLine progress={progress} reached={reached} active={active} instant={Boolean(reduced)} />

      <ul className="xl:grid xl:grid-cols-4">
        {VALUE_POINTS.map((point, index) => (
          <ValueItem
            key={point.id}
            point={point}
            index={index}
            mode={mode}
            reached={reached}
            reduced={reduced}
            isRtl={isRtl}
            onActivate={setActive}
          />
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */
function WhyChooseUs() {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const isRtl = i18n.dir() === "rtl";

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
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <section
      aria-label={t("whyChooseUs.title")}
      className="relative isolate overflow-hidden border-t border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      {BACKDROP_IMAGE ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={BACKDROP_IMAGE}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-neon/10" />
        </div>
      ) : null}

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

          <motion.div className="lg:col-span-5 lg:col-start-8" {...reveal(0.12)}>
            <div className="border-s-2 border-brand ps-5 sm:ps-6">
              <span aria-hidden="true" className="mb-4 block h-0.5 w-10 rounded-full bg-neon" />
              <p className="max-w-xl text-heading-md font-semibold leading-snug text-text-primary sm:text-3xl">
                {t("whyChooseUs.coreMessage")}
              </p>
            </div>
          </motion.div>
        </div>

        <ValuesBoard isRtl={isRtl} />
      </Container>
    </section>
  );
}

export default WhyChooseUs;