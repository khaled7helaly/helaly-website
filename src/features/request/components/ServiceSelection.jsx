import { useState } from "react";
import { Check, PencilLine } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../../components/ui/Button";
import services from "../../../data/services.json";
import readTranslation from "../../../lib/readTranslation";
import useRequestBuilder from "../hooks/useRequestBuilder";
import ServiceSelector from "./ServiceSelector";

/**
 * The first step of the request.
 *
 * Arriving from a service page or a proposal means the customer has already
 * chosen — asking again would be a step for the sake of a step. So the choice
 * is shown back as a resolved summary, and the full catalogue only appears
 * when there is nothing to show (a direct visit to /request) or when the
 * customer explicitly asks to change it.
 */
function ResolvedService({ service, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-brand/40 bg-brand/[0.05] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-text-secondary uppercase rtl:normal-case rtl:tracking-normal">
            {t("request.wizard.selectedService")}
          </p>

          <div className="mt-2.5 flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-5 shrink-0 items-center justify-center rounded-full border border-brand bg-surface text-brand-light"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <p className="text-heading-md leading-snug font-semibold text-text-primary">
              {readTranslation(t, service.titleKey)}
            </p>
          </div>

          <p className="ms-[1.875rem] mt-1 text-sm text-text-secondary">
            {t(`services.categories.${service.category}.title`)}
          </p>

          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-text-secondary">
            {readTranslation(t, service.shortDescriptionKey)}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onChange}
          className="shrink-0"
        >
          <PencilLine size={16} aria-hidden="true" />
          {t("request.wizard.changeService")}
        </Button>
      </div>
    </div>
  );
}

function ServiceSelection({ validationErrors = [] }) {
  const { state } = useRequestBuilder();
  const [isChoosing, setIsChoosing] = useState(false);

  const service =
    services.find((item) => item.id === state.selectedServiceId) ?? null;

  if (!service || isChoosing) {
    return (
      <ServiceSelector
        validationErrors={validationErrors}
        onSelect={() => setIsChoosing(false)}
      />
    );
  }

  return <ResolvedService service={service} onChange={() => setIsChoosing(true)} />;
}

export default ServiceSelection;
