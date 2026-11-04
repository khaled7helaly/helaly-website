import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function BrandLogo({
  onNavigate,
  className = "",
  wordmarkRef,
  isWordmarkHidden = false,
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label={`Helaly — ${t("common.home")}`}
      className={`inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      {/* One small mint mark, and a neutral wordmark: the identity is
          black-and-white first, with a single accent detail. */}
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-xl bg-brand text-lg font-extrabold tracking-tight text-on-brand shadow-sm shadow-black/20"
      >
        H
      </span>
      <span
        ref={wordmarkRef}
        style={{ visibility: isWordmarkHidden ? "hidden" : undefined }}
        aria-hidden={isWordmarkHidden}
        className="text-lg font-extrabold tracking-[0.12em] text-text-primary"
      >
        HELALY.
      </span>
    </Link>
  );
}

export default BrandLogo;
