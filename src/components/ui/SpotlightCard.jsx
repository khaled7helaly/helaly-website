/**
 * SpotlightCard — a glass card that is lit by the cursor.
 * Put it in: components/ui/SpotlightCard.jsx
 *
 * At rest it already looks lit: a faint sheen, a soft brand glow in the corner,
 * film grain and a hairline highlight on the top edge. With a mouse, the border
 * and the surface light up around the cursor. Touch and keyboard users get the
 * calm static card.
 *
 * Children can read these CSS variables (set on the card while the pointer moves):
 *   --mx / --my   pointer position in px, relative to the card
 *   --px / --py   pointer position from -0.5 to 0.5 (back to 0 when it leaves) — handy for parallax
 *
 * Notes
 * - The light uses the `brand` token through currentColor, so it follows your theme.
 * - Don't add `overflow-hidden` to the card itself: it would clip the border light.
 *   Clip inside it instead.
 *
 * Usage:
 *   <SpotlightCard as="article" className="flex flex-col">...</SpotlightCard>
 */

// Tiny grayscale noise tile, used as film grain.
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Keeps only the 1px edge of a layer, so a gradient can act as a "border".
const EDGE_ONLY_MASK = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

// Every light layer sits behind the content and follows the card's rounded corners.
const LAYER = "pointer-events-none absolute -inset-px -z-10 rounded-[inherit]";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SpotlightCard({
  as: Component = "div",
  className = "",
  children,
  ...props
}) {
  const handlePointerMove = (event) => {
    const card = event.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);

    if (!prefersReducedMotion()) {
      card.style.setProperty("--px", (x / width - 0.5).toFixed(3));
      card.style.setProperty("--py", (y / height - 0.5).toFixed(3));
    }
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <Component
      {...props}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative isolate rounded-3xl border border-border bg-surface ${className}`}
    >
      {/* Sheen: the top of the glass catches a little light */}
      <span
        aria-hidden="true"
        className={`${LAYER} text-text-primary opacity-[0.035]`}
        style={{
          background: "linear-gradient(to bottom, currentColor, transparent 45%)",
        }}
      />

      {/* Ambient brand glow in the top corner */}
      <span
        aria-hidden="true"
        className={`${LAYER} text-brand opacity-[0.16] transition-opacity duration-500 group-hover:opacity-25`}
        style={{
          background:
            "radial-gradient(70% 55% at 15% 0%, currentColor, transparent)",
        }}
      />

      {/* Film grain */}
      <span
        aria-hidden="true"
        className={`${LAYER} opacity-[0.07] mix-blend-overlay`}
        style={{ backgroundImage: NOISE }}
      />

      {/* Hairline highlight on the top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px inset-x-10 -z-10 h-px text-text-primary opacity-30"
        style={{
          background:
            "linear-gradient(to right, transparent, currentColor, transparent)",
        }}
      />

      {/* Cursor light on the surface */}
      <span
        aria-hidden="true"
        className={`${LAYER} text-brand opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]`}
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), currentColor, transparent 65%)",
        }}
      />

      {/* Cursor light on the border */}
      <span
        aria-hidden="true"
        className={`${LAYER} p-px text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        style={{
          background:
            "radial-gradient(300px circle at var(--mx, 50%) var(--my, 0%), currentColor, transparent 70%)",
          ...EDGE_ONLY_MASK,
        }}
      />

      {children}
    </Component>
  );
}

export default SpotlightCard;