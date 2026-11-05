import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { ORDERED_PROCESS_STEPS as ORDERED_STEPS } from "../../../lib/processSteps";

/*
  Our process: the steps on the start side, a sticky image on the end side.

  The icons are the stops on a dotted line. When the next step reaches the middle of
  the screen, a small dot carries the line down from one icon to the next, and the new
  icon lights up as it arrives. Scrolling back up plays it in reverse.

  Why it is fast: there is no scroll listener and nothing runs on every frame. One
  IntersectionObserver reports a step only when it crosses the middle of the screen,
  and everything else is a CSS transition on transform, opacity or colour. The image is
  one static layer, the background is two gradients painted once, and the steps are
  memoised, so a change re-renders two rows instead of the whole section.

  One colour (the brand) plus neutrals. Reduced motion gets a static, fully lit list.
  RTL mirrors itself.
*/

/* ---------- Your image ---------- */

// Paste your image link into `src`. While it is empty (or the link fails to load)
// a branded placeholder frame is shown instead. Leave `alt` empty if the image is decorative.
const PROCESS_IMAGE = {
  src: "https://i.pinimg.com/736x/89/84/af/8984af6c587d9f816b554066a6370277.jpg",
  alt: "",
};

const STEP_COUNT = ORDERED_STEPS.length;

const pad = (value) => String(value).padStart(2, "0");

/* ---------- The cut of the image ---------- */

// Corners as [x%, y%], written for left-to-right: a shallow cut at the top start and a
// steeper one at the bottom end. The other two corners stay square. Tweak to taste.
const SHAPE = [[0, 9], [22, 0], [100, 0], [100, 88], [86, 100], [0, 100]];

const mirror = (rtl) => SHAPE.map(([x, y]) => [rtl ? 100 - x : x, y]);
const toClip = (points) => `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
const toSvg = (points) => points.map(([x, y]) => `${x},${y}`).join(" ");

/* ---------- Static paint (gradients only, painted once) ---------- */

const GLOW_A = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 14%, transparent), transparent)",
};

const GLOW_B = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 10%, transparent), transparent)",
};

const PLACEHOLDER_STYLE = {
  backgroundImage:
    "radial-gradient(90% 70% at 15% 0%, color-mix(in oklab, var(--brand) 24%, transparent), transparent 70%)",
};

// Dark in both themes, so the white caption on top of any image stays readable.
const SCRIM_STYLE = {
  backgroundImage:
    "linear-gradient(to top, rgb(3 12 8 / 0.82), rgb(3 12 8 / 0.4) 42%, transparent 72%)",
};

const RING_STYLE = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 26%, transparent), transparent)",
};

// The dotted line. The colour comes from the text colour of the element it sits on.
const DOTS = {
  backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 2px)",
  backgroundSize: "16px 10px",
  backgroundRepeat: "repeat-y",
};

/* ---------- Sticky image card ---------- */

// A 1px outline that follows the cut exactly, whatever size the card is.
function Outline({ points, className, style }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 size-full overflow-visible text-brand ${className}`}
      style={style}
    >
      <polygon
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ProcessVisual({ activeStep, activeIndex, isRtl, tracking, t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(PROCESS_IMAGE.src) && !imageFailed;

  const points = useMemo(() => mirror(isRtl), [isRtl]);
  const clipPath = useMemo(() => toClip(points), [points]);
  const svgPoints = useMemo(() => toSvg(points), [points]);
  const shown = !tracking || inView;

  return (
    <div
      ref={ref}
      className={`relative aspect-[4/3] max-h-[calc(100svh-9rem)] transition-[opacity,transform] duration-[900ms] ease-out motion-reduce:transition-none sm:aspect-[16/10] md:aspect-[4/5] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* A faint copy of the outline, pushed out to the end: depth without a shadow */}
      <Outline
        points={svgPoints}
        className="opacity-25"
        style={{ transform: `translate3d(${isRtl ? -14 : 14}px, 14px, 0)` }}
      />

      <div className="absolute inset-0 bg-surface" style={{ clipPath }}>
        <div aria-hidden="true" className="absolute inset-0" style={PLACEHOLDER_STYLE} />

        {hasImage ? (
          <img
            src={PROCESS_IMAGE.src}
            alt={PROCESS_IMAGE.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          ORDERED_STEPS.map((step, index) => {
            const StepIcon = step.Icon;

            return (
              <div
                key={step.id}
                aria-hidden="true"
                className={`absolute inset-0 flex items-center justify-center text-brand-light transition-opacity duration-500 motion-reduce:transition-none ${
                  index === activeIndex ? "opacity-25" : "opacity-0"
                }`}
              >
                <StepIcon size={120} strokeWidth={1} />
              </div>
            );
          })
        )}

        {tracking && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SCRIM_STYLE} />

            {/* Kept away from the cut on the end side */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="max-w-[78%]">
                {/* Every caption is in place and only fades, so nothing is mounted or measured. */}
                <div aria-hidden="true" className="relative min-h-14">
                  {ORDERED_STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={`absolute inset-x-0 bottom-0 transition-[opacity,transform] ease-out motion-reduce:transition-none ${
                        index === activeIndex
                          ? "translate-y-0 opacity-100 duration-500 delay-150"
                          : "translate-y-2 opacity-0 duration-200"
                      }`}
                    >
                      <p className="text-xs font-semibold text-white/70">
                        {t("process.activeStage")}
                      </p>
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-lg font-semibold text-white">
                        <bdi dir="ltr" className="font-mono text-sm text-neon">
                          {pad(step.order)} / {pad(STEP_COUNT)}
                        </bdi>
                        <span>{t(step.titleKey)}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {activeStep
                    ? `${t("process.activeStage")} ${pad(activeStep.order)} / ${pad(STEP_COUNT)} ${t(activeStep.titleKey)}`
                    : ""}
                </p>

                <div aria-hidden="true" className="mt-4 flex gap-1.5">
                  {ORDERED_STEPS.map((step, index) => (
                    <span
                      key={step.id}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                    >
                      <span
                        className={`block size-full origin-left rounded-full bg-neon transition-transform duration-500 motion-reduce:transition-none rtl:origin-right ${
                          activeIndex >= index ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Outline points={svgPoints} className="opacity-60" />
    </div>
  );
}

/* ---------- Steps ---------- */

// Geometry: a row has 2rem of padding above a 3rem icon, so the icon's centre is 3.5rem
// from the top of the row. Each row draws the line from its own icon down to the next
// one (3.5rem past the row's bottom), so it stays right however long the text is.
const ProcessStage = memo(function ProcessStage({ step, index, state, isLast, tracking, t }) {
  const Icon = step.Icon;
  const lit = state !== "upcoming";
  const current = tracking && state === "current";
  // The icon waits for the dot to arrive; going back up it dims straight away.
  const arrive = tracking && lit ? "delay-[550ms]" : "delay-0";

  return (
    <li data-index={index} className="relative">
      {!isLast && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[3.5rem] -bottom-[3.5rem] start-[calc(1.5rem-8px)] w-4 overflow-hidden"
        >
          <span className="absolute inset-0 text-border" style={DOTS} />
          <span
            className={`absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.45,0,0.2,1)] motion-reduce:transition-none ${
              state === "complete" ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <span className="absolute inset-0 text-brand" style={DOTS} />
            <span className="absolute inset-x-0 bottom-0 mx-auto size-2 translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/20" />
          </span>
        </span>
      )}

      <article
        className={`grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-5 py-8 transition-opacity duration-700 motion-reduce:transition-none sm:gap-x-6 ${
          tracking && state === "upcoming" ? "opacity-60" : "opacity-100"
        }`}
      >
        <div aria-hidden="true" className="relative z-[1] size-12">
          <span
            className={`absolute -inset-2 rounded-full transition-[opacity,transform] duration-700 motion-reduce:transition-none ${
              current ? "scale-100 opacity-100 delay-[550ms]" : "scale-75 opacity-0 delay-0"
            }`}
            style={RING_STYLE}
          />
          <span
            className={`relative flex size-full items-center justify-center rounded-2xl border bg-surface transition-colors duration-500 motion-reduce:transition-none ${arrive} ${
              lit ? "border-brand/60 text-brand-light" : "border-border text-text-secondary"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-2xl bg-brand transition-opacity duration-500 motion-reduce:transition-none ${arrive} ${
                lit ? "opacity-10" : "opacity-0"
              }`}
            />
            <Icon size={20} strokeWidth={1.8} className="relative" />
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex min-h-12 items-center gap-3">
            <bdi dir="ltr" aria-hidden="true" className="font-mono text-xs text-text-secondary">
              {pad(step.order)}
            </bdi>
            <span className="sr-only">
              {t("process.stepCounter", {
                number: step.order,
                total: STEP_COUNT,
              })}
            </span>
            <h3 className="text-heading-md font-semibold leading-tight text-text-primary">
              {t(step.titleKey)}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            {t(step.descriptionKey)}
          </p>
        </div>
      </article>
    </li>
  );
});

/* ---------- Section ---------- */

function OurProcess() {
  const { t, i18n } = useTranslation();
  const listRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const tracking = !prefersReducedMotion;
  const [activeIndex, setActiveIndex] = useState(0);
  const isRtl = i18n.dir() === "rtl";

  // A step becomes the active one when it crosses a thin band a little above the middle
  // of the screen. The observer only reports crossings, so this costs nothing in between.
  useEffect(() => {
    const list = listRef.current;
    if (!tracking || !list || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveIndex(Number(entry.target.dataset.index));
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );

    list.querySelectorAll("[data-index]").forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [tracking]);

  const activeStep = ORDERED_STEPS[activeIndex] ?? ORDERED_STEPS[0];

  return (
    <section
      aria-label={t("process.title")}
      className="relative isolate overflow-x-clip border-t border-border bg-surface/40 py-16 sm:py-20 lg:py-24"
    >
      {/* Two soft splashes of the brand colour, painted once. They never move. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute top-0 -end-40 size-[36rem] rounded-full" style={GLOW_A} />
        <span className="absolute bottom-0 -start-40 size-[32rem] rounded-full" style={GLOW_B} />
      </div>

      <Container>
        <div className="mb-12 max-w-2xl sm:mb-14 lg:mb-16">
          <p className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-light rtl:normal-case rtl:tracking-normal">
            <span aria-hidden="true" className="size-2 rounded-full bg-neon shadow-sm shadow-neon/50" />
            {t("process.eyebrow")}
          </p>

          <SectionHeading
            title={t("process.title")}
            description={t("process.description")}
            className="max-w-xl"
          />

          {prefersReducedMotion && (
            <p className="mt-8 max-w-xl border-s-2 border-brand ps-4 text-sm leading-7 text-text-secondary sm:ps-5">
              {t("process.stagesSummary")}
            </p>
          )}
        </div>

        <div className="grid gap-10 md:grid-cols-[1.12fr_0.88fr] md:gap-12 lg:gap-16 xl:gap-20">
          <div className="md:order-2 md:sticky md:top-28 md:self-start">
            <ProcessVisual
              activeStep={activeStep}
              activeIndex={activeIndex}
              isRtl={isRtl}
              tracking={tracking}
              t={t}
            />
          </div>

          <ol ref={listRef} className="relative min-w-0 md:order-1">
            {ORDERED_STEPS.map((step, index) => (
              <ProcessStage
                key={step.id}
                step={step}
                index={index}
                state={
                  !tracking || index < activeIndex
                    ? "complete"
                    : index === activeIndex
                      ? "current"
                      : "upcoming"
                }
                isLast={index === STEP_COUNT - 1}
                tracking={tracking}
                t={t}
              />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default OurProcess;