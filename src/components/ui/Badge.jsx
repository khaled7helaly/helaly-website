function Badge({
  children,
  variant = "brand",
  size = "md",
  className = "",
  as: Element = "span",
  ...props
}) {
  const variants = {
    brand: "bg-brand/10 text-brand-light border-brand/20",
    neutral: "bg-surface text-text-secondary border-border",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    neon: "bg-neon/15 text-neon-ink dark:text-neon border-neon/30",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <Element
      className={`
        inline-flex items-center
        rounded-full border font-medium
        ${variants[variant] || variants.brand}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </Element>
  );
}

export default Badge;
