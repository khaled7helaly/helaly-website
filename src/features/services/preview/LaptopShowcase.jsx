import { motion, useReducedMotion } from "motion/react";

import { getPreview } from "./previewMap";
import { renderScreen } from "./screenRegistry";

/**
 * Premium laptop mockup for the Service Details hero.
 *
 * The screen is a real composition, not a screenshot: `screenLayouts.jsx`
 * draws it from HTML and SVG at a fixed 1280 x 800 design size, and this frame
 * scales that canvas to whatever width the hero gives it. That keeps one
 * design system across all seventeen services while letting each one show the
 * shape of its own deliverable.
 *
 * The hardware is deliberately neutral — a dark lid, a dark deck, one thin
 * specular edge — so it belongs to the black-and-white system and does not
 * compete with the accent the hero already uses for light. Colours come from
 * the `--pv-*` tokens in src/styles/index.css, which are fixed rather than
 * theme-derived: a screen that inverted with the page would look like a
 * malfunctioning display.
 *
 * The whole block is decorative. The h1 names the service, so this is hidden
 * from assistive technology instead of being announced as content.
 */

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 800;
const EASE = [0.22, 1, 0.36, 1];

/**
 * Scales the fixed-size screen canvas to the frame width.
 *
 * `tan(atan2(100cqw, 1280px))` resolves to "container width / design width"
 * as a plain number, which is exactly the scale factor. The same technique
 * drives the homepage dashboard, so the two mockups share one approach.
 */
function ScaledScreen({ children }) {
  return (
    <div className="relative h-full w-full" style={{ containerType: "inline-size" }}>
      <div
        className="absolute start-0 top-0 origin-top-left rtl:origin-top-right"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          transform: `scale(tan(atan2(100cqw, ${SCREEN_WIDTH}px)))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LaptopShowcase({ service, ordinal = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  const { layout, variant, accentIndex } = getPreview({
    slug: service.slug,
    category: service.category,
    ordinal,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="service-preview relative w-full"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: prefersReducedMotion ? 0 : 0.18,
        ease: EASE,
      }}
    >
      {/* Light from the display onto the hero. Painted first so the frame
          composites above it without needing a negative z-index. */}
      <span
        className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[16%] rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--hero-motif-accent), var(--hero-motif-accent-soft) 55%, transparent 72%)",
        }}
      />

      <div className="relative">
        {/* Lid: bezel, camera, and the screen itself. */}
        <div className="relative mx-auto w-[95%] rounded-t-[0.85rem] bg-[var(--pv-lid)] p-[7px] shadow-[inset_0_1px_0_var(--pv-lid-edge)]">
          <span className="absolute start-1/2 top-[2px] size-[3px] -translate-x-1/2 rounded-full bg-white/30 rtl:translate-x-1/2" />

          <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-[var(--pv-canvas)] ring-1 ring-black/50">
            <ScaledScreen>
              {renderScreen(layout, { accentIndex, variant })}
            </ScaledScreen>

            {/* Specular sheen. Barely visible by design: enough to read as
                glass, not enough to wash out the composition underneath. */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(114deg, var(--pv-glare), transparent 34%, transparent 78%, rgba(255, 255, 255, 0.03))",
              }}
            />
          </div>
        </div>

        {/* Deck: slightly wider than the lid, with the hinge notch. */}
        <div className="relative mx-auto w-full">
          <div className="h-[9px] rounded-b-[0.7rem] bg-[linear-gradient(to_bottom,var(--pv-lid),var(--pv-deck))] shadow-[inset_0_1px_0_var(--pv-lid-edge)]" />
          <span className="absolute start-1/2 top-0 h-[3px] w-[11%] -translate-x-1/2 rounded-b-full bg-black/45 rtl:translate-x-1/2" />
        </div>

        {/* Contact shadow in the hero's own ink, so it works on both tones:
            dark on the luminous hero, a soft halo on the deep one. */}
        <span
          className="pointer-events-none absolute inset-x-[6%] -bottom-4 h-7 blur-xl"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in srgb, var(--hero-ink) 26%, transparent), transparent 72%)",
          }}
        />
      </div>

      {ordinal > 0 ? (
        <span className="absolute end-[3%] -top-5 rounded-full border border-border bg-background/70 px-3 py-1 text-small font-semibold tabular-nums text-brand-light backdrop-blur-sm">
          {String(ordinal).padStart(2, "0")}
        </span>
      ) : null}
    </motion.div>
  );
}

export default LaptopShowcase;
