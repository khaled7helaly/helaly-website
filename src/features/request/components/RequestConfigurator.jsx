import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router";

import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import AddonSelector from "./AddonSelector";
import BudgetTimelineForm from "./BudgetTimelineForm";
import CustomerDetailsForm from "./CustomerDetailsForm";
import OrderSummary from "./OrderSummary";
import ProjectDetailsForm from "./ProjectDetailsForm";
import RequestProgress from "./RequestProgress";
import ServiceSelection from "./ServiceSelection";
import WhatsAppSubmitButton from "./WhatsAppSubmitButton";
import services from "../../../data/services.json";
import getDisplayErrors from "../utils/getDisplayErrors";
import useRequestBuilder from "../hooks/useRequestBuilder";
import validateRequest from "../utils/validateRequest";

const LAST_STEP = 3;

const userPrefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RequestConfigurator() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useRequestBuilder();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [errorFocusTick, setErrorFocusTick] = useState(0);

  const prefillAttempted = useRef(false);
  // The first sync pass runs in the same commit as the prefill dispatch, when
  // the state has not caught up yet; skipping it avoids rewriting the URL twice.
  const syncReady = useRef(false);
  const wizardRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const previousStep = useRef(currentStep);

  // Entry points hand over a service slug (buildRequestUrl), and a proposal
  // also hands over the extras it had ticked. The wizard reads them once on
  // arrival and never fights the customer afterwards.
  useEffect(() => {
    if (prefillAttempted.current) {
      return;
    }

    prefillAttempted.current = true;
    const requestedService = services.find(
      (service) => service.slug === searchParams.get("service"),
    );

    if (
      !requestedService ||
      state.selectedServiceId ||
      state.selectedCategoryId
    ) {
      return;
    }

    const requestedAddonIds = (searchParams.get("addons") ?? "")
      .split(",")
      .filter(Boolean);

    dispatch({
      type: "SET_SELECTION",
      payload: {
        serviceId: requestedService.id,
        addonIds: requestedAddonIds,
      },
    });

    // The extras hint has been consumed, so the URL goes back to describing the
    // wizard's own selection — which the effect below keeps in step.
    if (requestedAddonIds.length > 0) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("addons");
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    dispatch,
    searchParams,
    setSearchParams,
    state.selectedCategoryId,
    state.selectedServiceId,
  ]);

  // Keep the URL truthful once the customer changes the selection: the share
  // link and a refresh should both describe the service they are looking at.
  useEffect(() => {
    if (!syncReady.current) {
      syncReady.current = true;
      return;
    }

    const selectedSlug =
      services.find((service) => service.id === state.selectedServiceId)?.slug ??
      "";
    const currentSlug = searchParams.get("service") ?? "";

    if (selectedSlug === currentSlug) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (selectedSlug) {
      nextParams.set("service", selectedSlug);
    } else {
      nextParams.delete("service");
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, state.selectedServiceId]);

  // Bring the wizard back into view on every step change. Without it the
  // customer stays parked on the footer buttons while the new step renders
  // above them.
  useEffect(() => {
    if (previousStep.current === currentStep) {
      return;
    }

    previousStep.current = currentStep;
    wizardRef.current?.scrollIntoView({
      block: "start",
      behavior: userPrefersReducedMotion() ? "auto" : "smooth",
    });
  }, [currentStep]);

  // Focus the summary only after a failed Continue, once it has rendered, so
  // assistive tech reads the problems instead of an empty step.
  useEffect(() => {
    if (errorFocusTick === 0) {
      return;
    }

    errorSummaryRef.current?.focus();
  }, [errorFocusTick]);

  const currentValidation = validateRequest(state, currentStep);
  const stepErrors = showValidationErrors ? currentValidation.errors : [];
  const summaryErrors = getDisplayErrors(stepErrors);

  const goToStep = (step) => {
    setCurrentStep(step);
    setShowValidationErrors(false);
  };

  const handleContinue = () => {
    if (!currentValidation.isValid) {
      setShowValidationErrors(true);
      setErrorFocusTick((tick) => tick + 1);
      return;
    }

    goToStep(Math.min(currentStep + 1, LAST_STEP));
  };

  const isRtl = i18n.dir() === "rtl";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          title={t("common.startProject")}
          description={t("request.wizard.description")}
          className="mb-8"
        />

        <div
          ref={wizardRef}
          className="scroll-mt-24 rounded-2xl border border-border bg-background/60 p-4 sm:p-7"
        >
          <RequestProgress
            currentStep={currentStep}
            onStepSelect={goToStep}
          />

          <div
            key={currentStep}
            className="transition-opacity duration-200 motion-reduce:transition-none"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                {t(`request.wizard.steps.step${currentStep}.title`)}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {t(`request.wizard.steps.step${currentStep}.description`)}
              </p>
            </div>

            {summaryErrors.length > 0 && (
              <div
                ref={errorSummaryRef}
                role="alert"
                tabIndex={-1}
                className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200 focus:outline-none"
              >
                <p className="font-semibold">
                  {t("request.wizard.errorSummary")}
                </p>
                <ul className="mt-2 space-y-1">
                  {summaryErrors.map((error) => (
                    <li key={error.field}>{t(error.messageKey)}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-8">
                <ServiceSelection validationErrors={stepErrors} />

                {/* Only worth asking about once we know what is being built:
                    the fields and the prompts come from the service itself. */}
                {state.selectedServiceId ? (
                  <>
                    <ProjectDetailsForm />
                    <AddonSelector />
                  </>
                ) : null}
              </div>
            )}
            {currentStep === 2 && (
              <BudgetTimelineForm validationErrors={stepErrors} />
            )}
            {currentStep === 3 && (
              <>
                <CustomerDetailsForm validationErrors={stepErrors} />
                <div className="mt-8">
                  <OrderSummary onEditStep={goToStep} />
                </div>
                <WhatsAppSubmitButton />
              </>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                className="flex-1 sm:flex-none"
              >
                <BackIcon size={18} aria-hidden="true" />
                {t("request.wizard.back")}
              </Button>
            ) : null}

            {currentStep < LAST_STEP ? (
              <Button
                onClick={handleContinue}
                className="flex-1 sm:ms-auto sm:flex-none"
              >
                {t("request.wizard.continue")}
                <ForwardIcon size={18} aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default RequestConfigurator;
