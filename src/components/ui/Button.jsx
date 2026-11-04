import React from "react";

/*
  Neutral-first buttons.

  The primary action is black on light surfaces and white on dark surfaces —
  it earns attention through contrast, not through a coloured fill. Mint is
  reserved for the focus ring and for hover details on the quieter variants,
  which is where a small accent actually signals "this responds to you".

  The outline border is mixed from `--text-primary` rather than `--border`:
  a 12% hairline is right for a card edge, but a button that relies on its
  border to be found needs 3:1 against whatever it sits on. Half-strength ink
  clears that on every surface in both themes, including the inverted hero
  where `--border` is only 10% of the hero ink.

  `brand` is the one exception to the neutral fill. A section built around a
  single action can carry the accent on that action alone; the ink on the mint
  is a near-black in both themes, so the label keeps its contrast either way.
*/

const Button = React.forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    as: Element = "button",
    className = "",
    type = "button",
    ...props
  },
  ref,
) {
  const variants = {
    primary:
      "bg-action text-action-ink hover:bg-action-hover shadow-lg shadow-black/25",

    brand: "bg-brand text-on-brand hover:bg-brand-bright",

    secondary:
      "border border-border bg-surface text-text-primary hover:border-brand/40 hover:bg-surface-raised",

    outline:
      "border border-text-primary/50 text-text-primary hover:border-brand hover:text-brand-light",

    ghost:
      "text-text-primary hover:bg-surface",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Element
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition-colors duration-300
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-brand-light
        focus-visible:ring-offset-2 focus-visible:ring-offset-background
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...(Element === "button" ? { type } : {})}
      {...props}
    >
      {children}
    </Element>
  );
});

export default Button;