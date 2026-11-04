import { useReducedMotion } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1];

// Reveal once, slightly before the block is fully on screen.
const REVEAL = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "0px 0px -12% 0px" },
};
const NO_REVEAL = {};

/**
 * Props for the parent of a revealed group. Children only need `variants`.
 *
 *   const reveal = useReveal();
 *   <motion.div variants={stagger()} {...reveal}>
 *     <motion.p variants={fadeUp} />
 *   </motion.div>
 *
 * With prefers-reduced-motion nothing is hidden or animated.
 */
export function useReveal() {
  return useReducedMotion() ? NO_REVEAL : REVEAL;
}

// Orchestrates its children one after another. Has no visual values of its own.
export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

// Lines grow from the inline start: pair with `origin-left rtl:origin-right`.
export const drawX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

// Vertical line growing downward: pair with `origin-top`.
export const drawY = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};