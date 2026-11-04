import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { getHeroComposition } from "../hero/heroCompositions";

/**
 * Service Hero backdrop.
 *
 * The hero follows the site theme: a luminous surface while the site is light,
 * a deep one while the site is dark. Both tones are rendered and cross-faded
 * with the site's own `dark:` variant, because a gradient cannot be
 * interpolated but opacity can.
 *
 * No theme is detected in JavaScript here — the `dark:` variant already follows
 * `html[data-theme]`, so there is exactly one source of truth for the theme.
 * The tone tokens themselves live in src/styles/index.css.
 */

const PARALLAX_RANGE = 18;

// Shared by every motif in src/features/services/hero/heroMotifs.jsx.
const HERO_MOTIF_VIEW_BOX = "0 0 1200 700";

function ToneLayer({ tone, Motif }) {
  // The luminous layer belongs to the light theme, the deep one to the dark
  // theme, so the artwork always matches the tone the page is painting.
  const fade =
    tone === "bright"
      ? "opacity-100 dark:opacity-0"
      : "opacity-0 dark:opacity-100";

  return (
    <div
      className={`service-hero-layer service-hero-layer--${tone} transition-opacity duration-500 ease-out ${fade}`}
    >
      {/* The wrapper owns the RTL mirror so it never competes with the
          parallax transform on the ancestor. */}
      <div className="service-hero-motif rtl:-scale-x-100">
        <svg viewBox={HERO_MOTIF_VIEW_BOX} fill="none" aria-hidden="true">
          <Motif />
        </svg>
      </div>
    </div>
  );
}

function ServiceHeroBackdrop({ service }) {
  const prefersReducedMotion = useReducedMotion();
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, PARALLAX_RANGE]);

  const { Motif, style } = getHeroComposition(service);

  return (
    <div
      ref={targetRef}
      aria-hidden="true"
      // The negative inset gives the parallax room to move without ever
      // exposing an edge, which also keeps the layout shift-free.
      className="pointer-events-none absolute inset-x-0 -top-16 -bottom-16 -z-10"
      style={style}
    >
      <motion.div
        className="absolute inset-0"
        style={prefersReducedMotion ? undefined : { y: parallaxY }}
      >
        <ToneLayer tone="bright" Motif={Motif} />
        <ToneLayer tone="deep" Motif={Motif} />
      </motion.div>
    </div>
  );
}

export default ServiceHeroBackdrop;
