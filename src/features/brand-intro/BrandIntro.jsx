import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import useBrandIntro from "./useBrandIntro";

const WORDMARK = "HELALY.";
const LETTERS = Array.from(WORDMARK);
const LETTER_REVEAL_DELAY = 0.14;
const LETTER_DURATION = 0.45;
const INITIAL_DELAY = 0.35;
const HOLD_DURATION = 0.75;
const TRAVEL_DURATION = 1.2;

function getWordmarkDestination(source, target) {
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  // Uniform scale based on width ratio preserves font geometry precisely
  const scale = targetRect.width / (sourceRect.width || 1);

  return {
    x: targetCenterX - sourceCenterX,
    y: targetCenterY - sourceCenterY,
    scale,
  };
}

function BrandIntro({ wordmarkTargetRef }) {
  const { isIntroActive, completeIntro } = useBrandIntro();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const wordmarkRef = useRef(null);
  const [phase, setPhase] = useState("writing");
  const [travelTarget, setTravelTarget] = useState(null);
  const travelDuration = prefersReducedMotion ? 0.25 : TRAVEL_DURATION;

  // Prevent background scrolling while intro is active
  useEffect(() => {
    if (!isIntroActive) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isIntroActive]);

  // Handle letter reveal timing, brief hold, and start of traveling transition
  useEffect(() => {
    if (!isIntroActive) return undefined;

    let cancelled = false;
    const revealAndHoldDuration = prefersReducedMotion
      ? 400
      : (INITIAL_DELAY + (WORDMARK.length - 1) * LETTER_REVEAL_DELAY + LETTER_DURATION + HOLD_DURATION) * 1000;

    const timeoutId = window.setTimeout(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled) return;

      const source = wordmarkRef.current;
      const target = wordmarkTargetRef.current;
      if (!source || !target) {
        completeIntro();
        return;
      }

      setTravelTarget(getWordmarkDestination(source, target));
      setPhase("traveling");
    }, revealAndHoldDuration);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    completeIntro,
    isIntroActive,
    prefersReducedMotion,
    wordmarkTargetRef,
  ]);

  // Recalculate destination on window resize during travel
  useEffect(() => {
    if (!isIntroActive || phase !== "traveling") return undefined;

    const handleResize = () => {
      const source = wordmarkRef.current;
      const target = wordmarkTargetRef.current;
      if (source && target) {
        setTravelTarget(getWordmarkDestination(source, target));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isIntroActive, phase, wordmarkTargetRef]);

  // Fallback timer to guarantee completion if animation events are interrupted
  useEffect(() => {
    if (!isIntroActive || phase !== "traveling") return undefined;

    const safetyTimerId = window.setTimeout(
      completeIntro,
      (travelDuration + 0.15) * 1000,
    );
    return () => window.clearTimeout(safetyTimerId);
  }, [completeIntro, isIntroActive, phase, travelDuration]);

  if (!isIntroActive) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("brandIntro.label", { defaultValue: "HELALY" })}
      className="brand-intro-overlay fixed inset-0 z-[100] isolate flex min-h-[100svh] items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* 
        Background layer: pure black full-screen canvas with subtle architectural shapes.
        Fades out smoothly during the transition to unveil the website underneath.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black pointer-events-auto"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "traveling" ? 0 : 1 }}
        transition={{
          duration: travelDuration,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="brand-intro-shape brand-intro-circle" />
        <div className="brand-intro-shape brand-intro-square" />
        <div className="brand-intro-shape brand-intro-outline" />
        <div className="brand-intro-shape brand-intro-crosshair" />
      </motion.div>

      {/* 
        Traveling Wordmark:
        Remains 100% visible throughout the entire travel phase, moving and scaling
        from viewport center into the exact target coordinates of the Navbar logo.
      */}
      <motion.div
        ref={wordmarkRef}
        role="img"
        aria-label={WORDMARK}
        className="relative z-10 select-none whitespace-nowrap text-center font-extrabold tracking-[0.12em] text-brand leading-none text-[clamp(2.75rem,10.5vw,7.5rem)] pointer-events-none"
        style={{
          transformOrigin: "50% 50%",
        }}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={
          phase === "traveling" && travelTarget
            ? {
                x: travelTarget.x,
                y: travelTarget.y,
                scale: travelTarget.scale,
              }
            : { x: 0, y: 0, scale: 1 }
        }
        transition={{
          duration: travelDuration,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={() => {
          if (phase === "traveling") {
            completeIntro();
          }
        }}
      >
        {LETTERS.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, filter: "blur(8px)", y: 6, scale: 0.96 }
            }
            animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
            transition={{
              delay: prefersReducedMotion ? 0 : INITIAL_DELAY + index * LETTER_REVEAL_DELAY,
              duration: prefersReducedMotion ? 0 : LETTER_DURATION,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default BrandIntro;
