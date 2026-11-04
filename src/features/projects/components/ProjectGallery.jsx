import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import readTranslation from "../../../lib/readTranslation";

/**
 * Builds the renderable image list. Anything without a source is dropped, and a
 * missing alt translation falls back to the project title so an image is never
 * described as an empty string.
 */
function useGalleryImages(project, t) {
  return useMemo(() => {
    const title = readTranslation(t, project.titleKey);
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];

    return gallery
      .filter((image) => typeof image?.src === "string" && image.src.trim().length > 0)
      .map((image, index) => ({
        id: `${image.src.trim()}-${index}`,
        src: image.src.trim(),
        alt: readTranslation(t, image.altKey) || title,
        width: Number.isFinite(image.width) && image.width > 0 ? image.width : 0,
        height: Number.isFinite(image.height) && image.height > 0 ? image.height : 0,
      }));
  }, [project, t]);
}

function GalleryImage({ image, ratio, onOpen, openLabel }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={openLabel}
      className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      <div className="w-full" style={{ aspectRatio: ratio }}>
        <img
          src={image.src}
          alt=""
          width={image.width || undefined}
          height={image.height || undefined}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <span
        aria-hidden="true"
        className="absolute end-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Maximize2 className="size-4" />
      </span>
    </button>
  );
}

function ProjectGallery({ project }) {
  const { t } = useTranslation();
  const images = useGalleryImages(project, t);

  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);

  // Drives the native modal: showModal() supplies the focus trap, inertness and
  // Escape handling, and closing through it restores focus to the thumbnail.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    if (activeIndex === null) {
      if (dialog.open) {
        dialog.close();
      }
      return undefined;
    }

    if (!dialog.open && typeof dialog.showModal === "function") {
      dialog.showModal();
    }

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  if (images.length === 0) {
    return null;
  }

  const closeViewer = () => setActiveIndex(null);

  const showPrevious = () =>
    setActiveIndex((current) => (current + images.length - 1) % images.length);

  const showNext = () =>
    setActiveIndex((current) => (current + 1) % images.length);

  const handleKeyDown = (event) => {
    if (images.length < 2) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const title = readTranslation(t, project.titleKey);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <h2 className="text-heading-md font-bold tracking-tight text-text-primary">
          {t("projects.gallery")}
        </h2>

        <ul className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
          {images.map((image, index) => {
            const isLead = images.length > 1 && index === 0;
            const hasDimensions = image.width > 0 && image.height > 0;

            return (
              <li
                key={image.id}
                className={isLead ? "md:col-span-2" : undefined}
              >
                <GalleryImage
                  image={image}
                  ratio={
                    hasDimensions
                      ? `${image.width} / ${image.height}`
                      : isLead || images.length === 1
                        ? "16 / 9"
                        : "4 / 3"
                  }
                  onOpen={() => setActiveIndex(index)}
                  openLabel={t("projects.openImage", {
                    current: index + 1,
                    alt: image.alt,
                  })}
                />
              </li>
            );
          })}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        onClose={closeViewer}
        onKeyDown={handleKeyDown}
        aria-label={t("projects.viewerLabel", { title })}
        className="fixed inset-0 m-0 h-full w-full max-w-none border-0 bg-transparent p-0"
      >
        {activeImage ? (
          // Clicking anywhere that is not the image or a control dismisses the viewer.
          <div
            className="flex h-full w-full flex-col bg-black/90 text-white"
            onClick={(event) => {
              if (!event.target.closest("button, img")) {
                closeViewer();
              }
            }}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="text-small tabular-nums text-white/75">
                {t("projects.imageCounter", {
                  current: activeIndex + 1,
                  total: images.length,
                })}
              </p>

              <button
                type="button"
                autoFocus
                onClick={closeViewer}
                aria-label={t("projects.closeViewer")}
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center px-2 pb-3 sm:px-6 sm:pb-6">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </div>

            {images.length > 1 ? (
              <div className="flex items-center justify-center gap-3 pb-4 sm:pb-6">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label={t("projects.previousImage")}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label={t("projects.nextImage")}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </section>
  );
}

export default ProjectGallery;
