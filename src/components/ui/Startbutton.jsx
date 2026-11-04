import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

/*
  The "Start project" button, made to stand out.

  An inverted pill (dark on the light theme, light on the dark theme) that carries a neon disc
  with the arrow. On hover or keyboard focus the disc floods the whole pill with neon, the label
  flips to dark ink and the arrow turns to point forward.

  Transform and colour only, so it stays cheap. Reduced motion: no movement, colour only.
  Same props as a Link: to, onClick, className...
*/

const SIZES = {
  sm: { pill: "h-10 gap-3 ps-4 pe-1", disc: "size-8", icon: 15 },
  md: { pill: "h-11 gap-3.5 ps-5 pe-1", disc: "size-9", icon: 16 },
  lg: { pill: "h-14 gap-4 ps-7 pe-1.5", disc: "size-11", icon: 20 },
};

function StartButton({ to, children, size = "md", className = "", ...props }) {
  const { pill, disc, icon } = SIZES[size] || SIZES.md;

  return (
    <Link
      to={to}
      className={`group relative inline-flex shrink-0 items-center overflow-hidden rounded-full bg-text-primary text-sm font-semibold text-background shadow-[0_12px_32px_-14px_var(--brand)] outline-offset-4 transition-[color,transform] duration-500 hover:text-on-brand focus-visible:text-on-brand active:scale-[0.98] motion-reduce:transition-none ${pill} ${className}`}
      {...props}
    >
      <span className="relative z-[2] whitespace-nowrap">{children}</span>

      <span className={`relative z-0 grid shrink-0 place-items-center rounded-full ${disc}`}>
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[16] group-focus-visible:scale-[16] motion-reduce:transition-none"
        />
        <ArrowUpRight
          aria-hidden="true"
          size={icon}
          className="relative text-on-brand transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45 rtl:-scale-x-100 rtl:group-hover:-rotate-45 rtl:group-focus-visible:-rotate-45 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

export default StartButton;