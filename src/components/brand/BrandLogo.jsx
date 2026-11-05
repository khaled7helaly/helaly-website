import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const LOGO_SRC = `${import.meta.env.BASE_URL}images/brand/image1.svg`;

/*
  The shared brand mark. The asset is a 1024x572 canvas whose artwork only fills
  the 766x146 region in the middle; the rest is transparent margin. Scaling the
  file by 1024/766 and offsetting it by half the remainder trims that margin in
  CSS, so the mark sits flush with the layout edges and keeps its original
  proportions. The asset itself is never edited or re-exported.

  The artwork is a single mint colour, which reads at ~12:1 on the dark theme
  but only ~1.8:1 on white. Light mode therefore deepens it with a brightness
  filter to about #00594A — the same weight the design tokens already use for
  accent marks on light surfaces (~8:1). Dark mode shows the original mint.
*/
const LOGO_ASPECT_RATIO = "766 / 146";
const LOGO_SCALE = "133.681%";
const LOGO_MARGIN = "-16.8404%";

function BrandLogo({
  onNavigate,
  className = "",
  sizeClassName = "h-6 sm:h-7",
  wordmarkRef,
  isWordmarkHidden = false,
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label={`Helaly — ${t("common.home")}`}
      className={`inline-flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      <span
        ref={wordmarkRef}
        aria-hidden={isWordmarkHidden}
        style={{
          aspectRatio: LOGO_ASPECT_RATIO,
          visibility: isWordmarkHidden ? "hidden" : undefined,
        }}
        className={`relative block shrink-0 overflow-hidden ${sizeClassName}`}
      >
        <img
          src={LOGO_SRC}
          alt="Helaly"
          className="absolute max-w-none object-cover brightness-[0.4] dark:brightness-100"
          style={{
            width: LOGO_SCALE,
            height: LOGO_SCALE,
            left: LOGO_MARGIN,
            top: LOGO_MARGIN,
          }}
        />
      </span>
    </Link>
  );
}

export default BrandLogo;
