import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { categories, countByCategory, services } from "../utils/serviceData";

const PILL_BASE =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const PILL_ACTIVE = "border-brand/60 bg-brand/10 text-text-primary";
const PILL_IDLE =
  "border-border bg-surface text-text-secondary hover:border-brand/50 hover:text-text-primary";

function ServiceCategories({ activeCategory = null, query = "", className = "" }) {
  const { t } = useTranslation();
  const listRef = useRef(null);
  const activePillRef = useRef(null);

  const current = activeCategory ?? null;
  const activeInfo = categories.find((category) => category.slug === current);

  // Switching category keeps the active search, so the two filters work together.
  const hrefFor = (slug) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (query.trim()) params.set("q", query);
    const search = params.toString();
    return search ? `/services?${search}` : "/services";
  };

  // On small screens the pills scroll sideways. Keep the selected one centred
  // by scrolling only the list itself (never the page); works in RTL as well.
  useEffect(() => {
    const list = listRef.current;
    const pill = activePillRef.current;

    if (!list || !pill || list.scrollWidth <= list.clientWidth) return;

    const listBox = list.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();
    const offset =
      pillBox.left + pillBox.width / 2 - (listBox.left + listBox.width / 2);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    list.scrollBy({ left: offset, behavior: reduceMotion ? "auto" : "smooth" });
  }, [current]);

  const items = [
    {
      id: "all",
      slug: null,
      label: t("services.categories.all"),
      count: services.length,
    },
    ...categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      label: t(category.titleKey),
      count: countByCategory[category.slug] ?? 0,
    })),
  ];

  return (
    <div className={className}>
      <nav aria-label={t("services.categories.navigationLabel")}>
        {/* -mx-5 / px-5 lets the list bleed to the screen edge on mobile;
            it matches Container's base padding and resets from `sm` up. */}
        <ul
          ref={listRef}
          className="-mx-5 -my-1 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const isActive = item.slug === current;

            return (
              <li key={item.id} className="shrink-0">
                <Link
                  ref={isActive ? activePillRef : null}
                  to={hrefFor(item.slug)}
                  preventScrollReset
                  aria-current={isActive ? "true" : undefined}
                  className={`${PILL_BASE} ${isActive ? PILL_ACTIVE : PILL_IDLE}`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                      isActive ? "bg-brand/20" : "bg-surface-raised"
                    }`}
                  >
                    {item.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Always rendered so the layout doesn't jump when the filter changes. */}
      <p
        aria-live="polite"
        className="mt-4 min-h-[1.5rem] text-sm leading-6 text-text-secondary"
      >
        {activeInfo ? t(activeInfo.descriptionKey) : null}
      </p>
    </div>
  );
}

export default ServiceCategories;