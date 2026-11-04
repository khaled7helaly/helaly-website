import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { heroFeaturedServices } from "../../services/utils/serviceData";

/*
  Cards hanging from a curved string: "I need a portfolio", "I need a website for my company", ...

  - They drift on their own and can be dragged with a mouse or a finger. Let go and they keep
    their momentum, then settle back into a drift in the direction you threw them.
  - Every card follows the string: it rises, falls and tilts with the curve as it travels, and
    swings a little when you throw it.
  - The cards are the services themselves, read from the same catalogue the services pages,
    navigation and request flow use, so nothing is listed twice. Only the services opted into
    the hero spotlight in src/data/services.json (heroFeatured, ordered by featuredOrder) appear
    here; everything else stays reachable through the Services page. No image, or an image that
    fails to load: the card shows its title in the image's place. Clicking a card opens that
    service's own page (services[].url).

  Performance: one rAF loop that only writes `transform` on a few elements. It stops while the rail is
  off screen, slows to a halt while hovered or focused, and does not drift on its own when the
  visitor prefers reduced motion (dragging still works). No filters, no backdrop-filter.
*/

// The hero spotlight, already reduced to the featured services and put in their
// configured order by the selector, so this component never names a service.
const CARDS = heroFeaturedServices;

const AUTO_SPEED = 36; // px/s, the idle drift
const GLIDE = 2.4; // how quickly speed settles toward the drift (higher = quicker)
const DRAG_THRESHOLD = 6; // px a press must move before it counts as a drag (less = a click)
const MAX_FLING = 2600; // px/s
const SWAY_PER_SPEED = 0.006; // degrees of swing per px/s
const MAX_SWAY = 9; // degrees
const SPRING = 70; // pendulum stiffness
const DAMPING = 7; // pendulum damping (lower = more swing)

const STRING_DEPTH = 60; // px from the rail's top edge to the lowest point of the string
const PIN_DROP = 6; // a card's top edge sits this far below the string
const OVERSHOOT = 160; // the string runs this far past each edge of the screen
const RAD_TO_DEG = 180 / Math.PI;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (value, min, size) => ((((value - min) % size) + size) % size) + min;

// Shown in the image slot when a card has no image.
const PLACEHOLDER_STYLE = {
  backgroundImage:
    "linear-gradient(145deg, color-mix(in oklab, var(--brand) 22%, transparent), color-mix(in oklab, var(--brand-deep) 12%, transparent))",
};

/* ---------- Geometry ---------- */

// The string is a parabola: y(u) = STRING_DEPTH - sag * u^2, with u = -1..1 across the string.
// Cards read their height and tilt from the same formula, so they always sit on the line.
function getLayout(width) {
  const small = width < 640;
  const cardW = small ? 204 : 240;
  const cardH = small ? 270 : 300;
  const slot = cardW + (small ? 18 : 34);
  const sag = clamp(width * 0.07, 34, 96);
  // Enough cards that the wrap-around always happens off screen, even when a card swings wide.
  const copies = Math.max(1, Math.ceil((width + slot * 4) / (CARDS.length * slot)));

  return {
    width,
    cardW,
    cardH,
    slot,
    sag,
    half: width / 2 + OVERSHOOT,
    copies,
    count: CARDS.length * copies,
    total: CARDS.length * copies * slot,
    height: STRING_DEPTH + cardH + 64,
  };
}

// A quadratic curve with symmetric ends is exactly that parabola.
const stringPath = ({ width, sag, half }) => {
  const centre = width / 2;
  const edge = STRING_DEPTH - sag;

  return `M ${centre - half} ${edge} Q ${centre} ${STRING_DEPTH + sag} ${centre + half} ${edge}`;
};

/* ---------- One card ---------- */

function RailCard({ card, index, hidden, width, height, text, nodeRef }) {
  const [broken, setBroken] = useState(false);
  const hasImage = Boolean(card.image) && !broken;

  return (
    <div
      ref={nodeRef}
      data-card={index}
      className="absolute left-0 top-0 will-change-transform"
      style={{ width, height, transformOrigin: "50% 0" }}
    >
      {/* Copies of the cards (needed to fill wide screens) are hidden from keyboards and screen readers. */}
      <Link
        to={card.url}
        draggable={false}
        tabIndex={hidden ? -1 : undefined}
        aria-hidden={hidden || undefined}
        className="group relative flex h-full flex-col rounded-[1.6rem] border border-border bg-surface p-2.5 text-text-primary shadow-[0_24px_46px_-30px_rgb(15_23_42/0.55)] outline-offset-4 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/50 focus-visible:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {/* The clothes-pin that holds it to the string. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 left-1/2 z-[1] h-8 w-[1.1rem] -translate-x-1/2 rounded-[0.4rem] bg-brand shadow-[0_3px_6px_-2px_rgb(0_0_0/0.35)] ring-1 ring-inset ring-white/25"
        >
          <span className="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full bg-white/90" />
        </span>

        <div
          aria-hidden="true"
          className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] ring-1 ring-inset ring-border"
          style={hasImage ? undefined : PLACEHOLDER_STYLE}
        >
          {hasImage ? (
            <img
              src={card.image}
              alt=""
              draggable={false}
              decoding="async"
              onError={() => setBroken(true)}
              className="size-full object-cover"
            />
          ) : (
            <span className="grid size-full place-items-center px-3 text-center text-2xl font-extrabold tracking-tight text-neon-ink rtl:tracking-normal">
              {text(card, "word")}
            </span>
          )}
        </div>

        <div className="relative mt-3 flex-1 px-1.5 pb-1 pe-10">
          <h3 className="line-clamp-2 text-[0.95rem] font-bold leading-5 tracking-tight rtl:tracking-normal">
            {text(card, "title")}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
            {text(card, "text")}
          </p>

          <span
            aria-hidden="true"
            className="absolute bottom-1 end-1 grid size-8 place-items-center rounded-full border border-border text-text-secondary transition-colors duration-300 group-hover:border-transparent group-hover:bg-text-primary group-hover:text-background group-focus-visible:border-transparent group-focus-visible:bg-text-primary group-focus-visible:text-background motion-reduce:transition-none"
          >
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </span>
        </div>
      </Link>
    </div>
  );
}

/* ---------- The rail ---------- */

function HeroCardsRail({ className = "" }) {
  const { t, i18n } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const rtl = i18n.dir() === "rtl";

  const railRef = useRef(null);
  const nodesRef = useRef([]);
  const layoutRef = useRef(null);
  const state = useRef({
    offset: 0, // how far the whole row has travelled (px)
    vel: 0, // current speed (px/s)
    dir: -1, // direction of the idle drift: -1 = leftward, 1 = rightward
    sway: 0, // swing angle shared by all cards (deg)
    swayV: 0,
    paintedOffset: Infinity,
    paintedSway: Infinity,
    started: false,
    reduce: false,
    hover: false,
    focus: false,
    pressed: false,
    dragging: false,
    moved: false, // a drag just happened: swallow the click that follows it
    pointerId: -1,
    startX: 0,
    lastX: 0,
    lastT: 0,
  });
  const [layout, setLayout] = useState(null);

  state.current.reduce = Boolean(prefersReducedMotion);

  // The rail borrows the service catalogue's own copy, so the Hero and the
  // service pages can never drift apart.
  const CARD_TEXT_SUFFIX = {
    word: "title",
    title: "intent",
    text: "shortDescription",
  };

  const text = (card, key) =>
    t(`services.items.${card.id}.${CARD_TEXT_SUFFIX[key]}`);

  // Writes every card's position and tilt. Cheap: a few transforms, no React work.
  const paint = useCallback(() => {
    const L = layoutRef.current;
    if (!L) return;

    const s = state.current;
    const nodes = nodesRef.current;
    const centre = L.width / 2;

    for (let n = 0; n < L.count; n += 1) {
      const node = nodes[n];
      if (!node) continue;

      const x = wrap(n * L.slot + s.offset, -2 * L.slot, L.total);
      const u = (x + L.cardW / 2 - centre) / L.half;
      const y = STRING_DEPTH - L.sag * u * u + PIN_DROP;
      const tilt = Math.atan((-2 * L.sag * u) / L.half) * RAD_TO_DEG;
      const swing = s.sway * (0.85 + (n % 3) * 0.15);

      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(tilt + swing).toFixed(2)}deg)`;
    }

    s.paintedOffset = s.offset;
    s.paintedSway = s.sway;
  }, []);

  // Idle drift goes toward the start of the reading direction.
  useEffect(() => {
    state.current.dir = rtl ? 1 : -1;
  }, [rtl]);

  // Measure the rail, and re-measure when it resizes.
  useLayoutEffect(() => {
    const rail = railRef.current;

    const measure = () => {
      const width = Math.round(rail.getBoundingClientRect().width);
      if (!width) return;
      setLayout((previous) => (previous && previous.width === width ? previous : getLayout(width)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);

    return () => observer.disconnect();
  }, []);

  // New layout: place the cards before the browser paints (no flash of stacked cards).
  useLayoutEffect(() => {
    layoutRef.current = layout;
    if (!layout) return;

    const s = state.current;
    if (!s.started) {
      s.started = true;
      s.offset = (layout.width - layout.cardW) / 2; // first card starts in the middle
      s.sway = s.reduce ? 0 : 12; // they swing in and settle
    }

    paint();
  }, [layout, paint]);

  // The loop. Runs only while the rail is on screen.
  useEffect(() => {
    const rail = railRef.current;
    const s = state.current;
    let frame = 0;
    let last = 0;

    const tick = (now) => {
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const L = layoutRef.current;

      if (L) {
        if (!s.dragging) {
          const calm = s.hover || s.focus || s.reduce;
          const target = calm ? 0 : s.dir * AUTO_SPEED;
          s.vel += (target - s.vel) * (1 - Math.exp(-GLIDE * dt));
          s.offset += s.vel * dt;
          if (Math.abs(s.offset) > L.total * 8) s.offset %= L.total;
        }

        // The swing is a damped spring that leans against the direction of travel.
        const lean = s.reduce ? 0 : clamp(s.vel * SWAY_PER_SPEED, -MAX_SWAY, MAX_SWAY);
        s.swayV += ((lean - s.sway) * SPRING - s.swayV * DAMPING) * dt;
        s.sway += s.swayV * dt;

        if (Math.abs(s.offset - s.paintedOffset) > 0.01 || Math.abs(s.sway - s.paintedSway) > 0.002) {
          paint();
        }
      }

      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const halt = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const watcher = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? run() : halt()),
      { rootMargin: "120px 0px" },
    );
    watcher.observe(rail);

    return () => {
      watcher.disconnect();
      halt();
    };
  }, [paint]);

  /* ---------- Pointer: drag with momentum ---------- */

  const onPointerDown = (event) => {
    const s = state.current;
    if (s.pressed || (event.pointerType === "mouse" && event.button !== 0)) return;

    s.pressed = true;
    s.moved = false;
    s.pointerId = event.pointerId;
    s.startX = s.lastX = event.clientX;
    s.lastT = performance.now();
  };

  const onPointerMove = (event) => {
    const s = state.current;
    if (!s.pressed || event.pointerId !== s.pointerId) return;

    if (!s.dragging) {
      if (Math.abs(event.clientX - s.startX) < DRAG_THRESHOLD) return;

      // Only now take over the pointer, so a plain click still reaches the card's link.
      s.dragging = true;
      s.moved = true;
      s.vel = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "";
    }

    const now = performance.now();
    const dx = event.clientX - s.lastX;
    const dt = Math.max((now - s.lastT) / 1000, 0.004);

    s.offset += dx;
    s.vel = s.vel * 0.6 + (dx / dt) * 0.4;
    s.lastX = event.clientX;
    s.lastT = now;
  };

  const endPress = (event) => {
    const s = state.current;
    if (!s.pressed || event.pointerId !== s.pointerId) return;

    s.pressed = false;
    if (!s.dragging) return;

    s.dragging = false;
    const rail = event.currentTarget;
    delete rail.dataset.dragging;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);

    if (performance.now() - s.lastT > 90) s.vel = 0; // held still before letting go
    s.vel = s.reduce ? 0 : clamp(s.vel, -MAX_FLING, MAX_FLING);
    if (Math.abs(s.vel) > 90) s.dir = Math.sign(s.vel); // keep drifting the way it was thrown

    window.setTimeout(() => {
      s.moved = false;
    }, 60);
  };

  // A drag must never open the card that happened to be under the pointer.
  const onClickCapture = (event) => {
    if (state.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /* ---------- Keyboard: pause, and bring the focused card on screen ---------- */

  const onFocus = (event) => {
    if (!event.target.matches(":focus-visible")) return;

    const s = state.current;
    const L = layoutRef.current;
    s.focus = true;
    s.vel = 0;

    const n = Number(event.target.closest("[data-card]")?.dataset.card);
    if (L && Number.isFinite(n)) {
      const x = wrap(n * L.slot + s.offset, -2 * L.slot, L.total);
      if (x < 0 || x > L.width - L.cardW) {
        s.offset = (L.width - L.cardW) / 2 - n * L.slot;
        paint();
      }
    }
  };

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) state.current.focus = false;
  };

  if (!CARDS.length) return null;

  return (
    <div className={className}>
      <div
        ref={railRef}
        role="group"
        aria-label={t("hero.chooser.label", { defaultValue: "What do you want to build?" })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") state.current.hover = true;
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") state.current.hover = false;
        }}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onFocus={onFocus}
        onBlur={onBlur}
        className="relative w-full cursor-grab touch-pan-y select-none overflow-x-clip data-[dragging]:cursor-grabbing"
        style={{ height: layout?.height ?? STRING_DEPTH + 300 + 64 }}
      >
        {layout && (
          <>
            <svg
              aria-hidden="true"
              focusable="false"
              width={layout.width}
              height={layout.height}
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
            >
              <path
                d={stringPath(layout)}
                fill="none"
                stroke="var(--text-primary)"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {Array.from({ length: layout.count }, (_, n) => (
              <RailCard
                key={n}
                card={CARDS[n % CARDS.length]}
                index={n}
                hidden={n >= CARDS.length}
                width={layout.cardW}
                height={layout.cardH}
                text={text}
                nodeRef={(node) => {
                  nodesRef.current[n] = node;
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default HeroCardsRail;
