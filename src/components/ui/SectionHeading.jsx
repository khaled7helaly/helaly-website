const ALIGNMENT = {
  start: "text-start",
  center: "mx-auto text-center",
  end: "ms-auto text-end",
};

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  as: Heading = "h2",
  className = "",
}) {
  return (
    <div
      className={`max-w-2xl ${ALIGNMENT[align] ?? ALIGNMENT.start} ${className}`}
    >
      {eyebrow && (
        <span className="mb-3 block text-sm font-semibold text-brand-light">
          {eyebrow}
        </span>
      )}

      {/* Letter-spacing and tight leading hurt Arabic joins, so RTL resets them. */}
      <Heading className="text-balance text-heading-lg font-bold leading-tight tracking-tight text-text-primary rtl:leading-snug rtl:tracking-normal">
        {title}
      </Heading>

      {description && (
        <p className="mt-4 text-pretty text-body leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;