import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Badge from "../../../components/ui/Badge";
import SpotlightCard from "../../../components/ui/SpotlightCard";

const MAX_VISIBLE_TECHNOLOGIES = 4;

// Everything that differs between the big "hero" card and a regular card.
const VARIANTS = {
  default: {
    header: "p-6 sm:p-7",
    title: "text-heading-md",
    description: "line-clamp-2 text-[0.95rem]",
    button: "h-10 w-10",
    stage: "min-h-[210px]",
    mock: "inset-x-5 sm:inset-x-6",
  },
  hero: {
    header: "p-6 sm:p-9 lg:p-10",
    title: "text-3xl sm:text-4xl",
    description: "line-clamp-3 max-w-xl text-base sm:text-lg",
    button: "h-12 w-12",
    stage: "min-h-[250px] md:min-h-[340px] lg:min-h-[420px]",
    mock: "inset-x-5 sm:inset-x-8 lg:inset-x-12",
  },
};

// The browser window leans toward the cursor (SpotlightCard sets --px / --py).
const TILT_STYLE = {
  transform:
    "perspective(1100px) rotateX(calc(var(--py, 0) * -6deg)) rotateY(calc(var(--px, 0) * 8deg))",
  transformOrigin: "50% 100%",
  transition: "transform 400ms ease-out",
  willChange: "transform",
};

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function Icon({ className = "", children }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowUpRightIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </Icon>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.6z" />
    </svg>
  );
}

// Abstract wireframe shown when a project has no screenshot yet.
function ScreenSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col gap-3 p-5">
      <span className="block h-3 w-2/5 rounded-full bg-border" />
      <span className="block h-3 w-3/5 rounded-full bg-border opacity-60" />
      <div className="mt-2 grid flex-1 grid-cols-3 gap-3">
        <span className="rounded-lg bg-border opacity-60" />
        <span className="rounded-lg bg-border opacity-40" />
        <span className="rounded-lg bg-border opacity-25" />
      </div>
    </div>
  );
}

function ProjectCard({ project, variant = "default", showFeatured = true }) {
  const { t } = useTranslation();
  const title = t(project.titleKey);
  const styles = VARIANTS[variant] ?? VARIANTS.default;

  const isFeatured = showFeatured && Boolean(project.featured);
  const hostname = project.demoUrl ? getHostname(project.demoUrl) : "";

  const technologies = project.technologies ?? [];
  const visibleTechnologies = technologies.slice(0, MAX_VISIBLE_TECHNOLOGIES);
  const hiddenCount = technologies.length - visibleTechnologies.length;

  return (
    <SpotlightCard as="article" className="flex h-full w-full flex-col">
      {/* Text */}
      <div className={styles.header}>
        <div className="flex items-start justify-between gap-5">
          <h3 className={`${styles.title} font-semibold text-text-primary`}>
            {/* Stretched link: the whole card is clickable, with a single tab stop. */}
            <Link
              to={`/work/${project.slug}`}
              className="rounded-sm after:absolute after:inset-0 after:z-10 after:rounded-3xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand"
            >
              {title}
            </Link>
          </h3>

          <span
            aria-hidden="true"
            className={`grid shrink-0 place-items-center rounded-full border border-border bg-surface-raised text-text-primary transition-colors duration-300 group-hover:border-brand group-hover:bg-brand/10 group-hover:text-brand-light ${styles.button}`}
          >
            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        <p
          className={`mt-3 leading-relaxed text-text-secondary ${styles.description}`}
        >
          {t(project.descriptionKey)}
        </p>

        {visibleTechnologies.length > 0 && (
          <ul
            className="mt-5 flex flex-wrap gap-2"
            aria-label={t("projects.technologiesLabel")}
          >
            {visibleTechnologies.map((technology) => (
              <li key={technology}>
                <Badge variant="neutral" size="sm">
                  {technology}
                </Badge>
              </li>
            ))}
            {hiddenCount > 0 && (
              <li>
                <Badge variant="neutral" size="sm">
                  +{hiddenCount}
                </Badge>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Stage: the project, shown in a browser window that peeks out of the card */}
      <div
        className={`relative flex-1 overflow-hidden rounded-b-[inherit] ${styles.stage}`}
      >
        {/* Backlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 text-brand opacity-30 transition-opacity duration-500 group-hover:opacity-50"
          style={{
            background:
              "radial-gradient(75% 90% at 50% 100%, currentColor, transparent 70%)",
          }}
        />

        {/* pointer-events-none: clicks fall through to the card link; only the demo link re-enables them. */}
        <div
          className={`pointer-events-none absolute -bottom-6 top-0 z-20 transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-3 ${styles.mock}`}
        >
          <div className="h-full" style={TILT_STYLE}>
            <div
              dir="ltr"
              className="flex h-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-border bg-surface-raised shadow-[0_0_60px_-10px_rgba(0,0,0,0.7)]"
            >
              {/* Browser bar: the address pill is the live-demo link, the star marks featured work */}
              <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border px-3.5">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="block h-2.5 w-2.5 rounded-full bg-text-secondary opacity-30" />
                  <span className="block h-2.5 w-2.5 rounded-full bg-text-secondary opacity-30" />
                  <span className="block h-2.5 w-2.5 rounded-full bg-text-secondary opacity-30" />
                </span>

                <div className="flex h-6 min-w-0 flex-1 items-center gap-2 rounded-md bg-surface px-2.5 text-[11px] text-text-secondary">
                  {hostname ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={t("projects.liveDemo")}
                      aria-label={t("projects.openDemo", { title })}
                      className="pointer-events-auto inline-flex min-w-0 items-center gap-1.5 rounded-sm transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="truncate">{hostname}</span>
                      <ArrowUpRightIcon className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="block h-1.5 w-24 rounded-full bg-border"
                    />
                  )}

                  {isFeatured && (
                    <span
                      role="img"
                      title={t("common.featured")}
                      aria-label={t("common.featured")}
                      className="ms-auto shrink-0 text-brand-light"
                    >
                      <StarIcon />
                    </span>
                  )}
                </div>
              </div>

              <div className="relative min-h-0 flex-1 bg-surface">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <ScreenSkeleton />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default ProjectCard;