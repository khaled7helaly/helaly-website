import Badge from "../../../components/ui/Badge";

/**
 * Renders project technologies as a wrapping chip list.
 * Renders nothing at all when there is nothing to show, so callers never
 * need to branch on whether the project has technology metadata.
 */
function TechnologyList({ technologies, label, className = "" }) {
  if (!Array.isArray(technologies)) {
    return null;
  }

  const items = technologies.filter(
    (technology) => typeof technology === "string" && technology.trim().length > 0,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {label ? (
        <p className="mb-3 text-small font-semibold tracking-[0.18em] text-text-secondary uppercase">
          {label}
        </p>
      ) : null}

      <ul className="flex flex-wrap gap-2">
        {items.map((technology) => (
          <li key={technology}>
            <Badge variant="neutral" size="sm">
              {technology}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TechnologyList;
