import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { ORDERED_PROCESS_STEPS as ORDERED_STEPS } from "../../../lib/processSteps";

/*
  Our process: the steps on the start side, a sticky image on the end side.

  Scroll drives everything. As the section moves through the viewport the line fills,
  each step lights up in turn, and the image card names the current stage.
  The image is revealed once; after that only transforms and opacity move
  (no filters, no backdrop-filter, no loops). Reduced motion gets a static, fully lit list.
*/

/* ---------- Your image ---------- */

// Paste your image link into `src`. While it is empty (or the link fails to load)
// a branded placeholder frame is shown instead. Leave `alt` empty if the image is decorative.
const PROCESS_IMAGE = {
  src: "https://i.pinimg.com/736x/89/84/af/8984af6c587d9f816b554066a6370277.jpg",
  alt: "",
};

const STEP_COUNT = ORDERED_STEPS.length;
const PROGRESS_RANGE = [0, 1];
const STAGE_CURSOR_RANGE = [0, STEP_COUNT];
// Step i becomes active at i / STEP_COUNT, so the line has to reach its marker at that moment.
const LINE_END = STEP_COUNT > 1 ? (STEP_COUNT - 1) / STEP_COUNT : 1;
const EASE = [0.22, 1, 0.36, 1];

const pad = (value) => String(value).padStart(2, "0");

/* ---------- Static paint (gradients only, painted once) ---------- */

const glowFor = (x) =>
  `radial-gradient(44rem 34rem at ${x}% 44%, color-mix(in oklab, var(--brand) 13%, transparent), transparent 70%)`;

const gridLine = "color-mix(in oklab, var(--text-primary) 7%, transparent)";

const PLACEHOLDER_STYLE = {
  backgroundImage: [
    "radial-gradient(90% 70% at 15% 0%, color-mix(in oklab, var(--brand) 30%, transparent), transparent 70%)",
    "radial-gradient(80% 60% at 100% 100%, color-mix(in oklab, var(--brand-deep) 48%, transparent), transparent 70%)",
    `linear-gradient(to right, ${gridLine} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "auto, auto, 40px 40px, 40px 40px",
};

// Dark in both themes, so the white caption on top of any image stays readable.
const SCRIM_STYLE = {
  backgroundImage:
    "linear-gradient(to top, rgb(3 12 8 / 0.82), rgb(3 12 8 / 0.4) 42%, transparent 72%)",
};

// The bright end of the gradient is always the tip of the filling line.
const LINE_FILL_STYLE = {
  backgroundImage:
    "linear-gradient(to bottom, var(--brand-deep), var(--brand) 55%, var(--brand-bright))",
};

const RING_STYLE = {
  backgroundImage:
    "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 30%, transparent), transparent)",
};

/* ---------- Sticky image card ---------- */

function ProcessVisual({
  activeStep,
  activeIndex,
  isLive,
  imageY,
  prefersReducedMotion,
  t,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(PROCESS_IMAGE.src) && !imageFailed;
  const ActiveIcon = activeStep?.Icon;
  const ImageTag = prefersReducedMotion ? "img" : motion.img;

  return (
    <div className="relative isolate aspect-[16/11] max-h-[calc(100svh-9rem)] overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/20 sm:aspect-[16/9] md:aspect-[4/5]">
      <div aria-hidden="true" className="absolute inset-0" style={PLACEHOLDER_STYLE} />

      {hasImage ? (
        <ImageTag
          src={PROCESS_IMAGE.src}
          alt={PROCESS_IMAGE.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 size-full object-cover"
          style={prefersReducedMotion ? undefined : { y: imageY, scale: 1.14 }}
        />
      ) : (
        ActiveIcon && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-brand-light"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeStep.id}
                className="block"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 0.25, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ActiveIcon size={120} strokeWidth={1} />
              </motion.span>
            </AnimatePresence>
          </div>
        )
      )}

      {!prefersReducedMotion && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SCRIM_STYLE} />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div aria-live="polite" aria-atomic="true" className="min-h-14">
              <AnimatePresence mode="wait" initial={false}>
                {isLive && activeStep && (
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    <p className="text-xs font-semibold text-white/70">
                      {t("process.activeStage")}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-lg font-semibold text-white">
                      <bdi dir="ltr" className="font-mono text-sm text-neon">
                        {pad(activeStep.order)} / {pad(STEP_COUNT)}
                      </bdi>
                      <span>{t(activeStep.titleKey)}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

          {/* One-time reveal: the card's own surface lifts away from the top. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 origin-top bg-surface"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
      />
    </div>
  );
}

/* ---------- Steps ---------- */

function ProcessStage({ step, index, activeIndex, prefersReducedMotion, t }) {
  const Icon = step.Icon;
  const tracking = !prefersReducedMotion;
  const isCurrent = tracking && activeIndex === index;
  const isComplete = tracking && activeIndex > index;
  const isUpcoming = tracking && activeIndex < index;

  const markerTone = isCurrent
    ? "border-brand text-brand-light"
    : isComplete
      ? "border-brand/50 text-brand-light"
      : "border-border text-text-secondary";

  return (
    <li className="border-b border-border last:border-b-0">
      <article
        className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-4 py-8 transition-opacity duration-500 motion-reduce:transition-none sm:gap-6 ${
          isUpcoming ? "opacity-70" : "opacity-100"
        }`}
      >
        <div aria-hidden="true" className="relative z-[1] size-14">
          <span
            className={`absolute -inset-2 rounded-full transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
              isCurrent ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
            style={RING_STYLE}
          />
          <span
            className={`relative flex size-full items-center justify-center rounded-full border bg-surface text-xl font-semibold transition-colors duration-300 motion-reduce:transition-none ${markerTone}`}
          >
            <span
              className={`absolute inset-0 rounded-full bg-brand transition-opacity duration-300 motion-reduce:transition-none ${
                isCurrent ? "opacity-10" : isComplete ? "opacity-5" : "opacity-0"
              }`}
            />
            <bdi dir="ltr" className="relative font-mono tracking-tight">
              {pad(step.order)}
            </bdi>
          </span>
        </div>

        <div className="relative min-w-0 py-0.5 ps-4 sm:ps-5">
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 start-0 w-0.5 origin-top rounded-full bg-brand transition-transform duration-500 ease-out motion-reduce:transition-none ${
              isCurrent ? "scale-y-100" : "scale-y-0"
            }`}
          />

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 motion-reduce:transition-none ${
                isCurrent
                  ? "border-brand/40 bg-brand/10 text-brand-light"
                  : "border-border bg-surface text-text-secondary"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
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
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary sm:mt-4 sm:text-base">
            {t(step.descriptionKey)}
          </p>
        </div>
      </article>
    </li>
  );
}

/* ---------- Section ---------- */

function OurProcess() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const isSectionInView = useInView(sectionRef, {
    once: false,
    amount: 0.03,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.6", "end 0.9"],
  });
  const stageCursor = useTransform(
    scrollYProgress,
    PROGRESS_RANGE,
    STAGE_CURSOR_RANGE,
  );
  const lineFill = useTransform(scrollYProgress, [0, LINE_END], PROGRESS_RANGE);
  const imageY = useTransform(scrollYProgress, PROGRESS_RANGE, ["-5%", "5%"]);

  useMotionValueEvent(stageCursor, "change", (latest) => {
    if (prefersReducedMotion || ORDERED_STEPS.length === 0) return;

    const nextIndex = Math.min(
      ORDERED_STEPS.length - 1,
      Math.max(0, Math.floor(latest)),
    );

    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  });

  const activeStep = ORDERED_STEPS[activeIndex] ?? ORDERED_STEPS[0];
  const glowX = i18n.dir() === "rtl" ? 14 : 86;

  return (
    <section
      ref={sectionRef}
      aria-label={t("process.title")}
      className="relative isolate border-t border-border bg-surface/40 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundImage: glowFor(glowX) }}
      />

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
              isLive={isSectionInView}
              imageY={imageY}
              prefersReducedMotion={prefersReducedMotion}
              t={t}
            />
          </div>

          <div className="relative min-w-0 md:order-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute start-7 top-[3.75rem] bottom-[3.75rem] w-0.5 -translate-x-1/2 bg-border"
            >
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 origin-top"
                  style={{ ...LINE_FILL_STYLE, scaleY: lineFill }}
                />
              )}
            </div>

            <ol className="relative">
              {ORDERED_STEPS.map((step, index) => (
                <ProcessStage
                  key={step.id}
                  step={step}
                  index={index}
                  activeIndex={activeIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  t={t}
                />
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default OurProcess;