import { useTranslation } from "react-i18next";

function RequestProgress({ currentStep, onStepSelect }) {
  const { t, i18n } = useTranslation();
  const steps = [1, 2, 3];
  const isRtl = i18n.dir() === "rtl";

  return (
    <nav
      aria-label={t("request.wizard.progressLabel")}
      className="mb-8"
    >
      <p className="mb-3 text-sm font-medium text-text-secondary">
        {t("request.wizard.stepCounter", {
          current: currentStep,
          total: steps.length,
        })}
      </p>
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const isCurrent = step === currentStep;
          const isCompleted = step < currentStep;
          const label = t(`request.wizard.steps.step${step}.title`);

          return (
            <li key={step} className="min-w-0">
              <button
                type="button"
                onClick={() => isCompleted && onStepSelect(step)}
                disabled={!isCompleted}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={t("request.wizard.stepAccessibleLabel", {
                  number: step,
                  title: label,
                })}
                className={`
                  flex w-full flex-col items-center gap-2
                  text-center text-xs transition-colors sm:flex-row sm:text-start
                  ${isCurrent ? "text-text-primary" : "text-text-secondary"}
                  ${isCompleted ? "cursor-pointer hover:text-brand-light" : "cursor-default"}
                  disabled:opacity-100
                `}
              >
                <span
                  className={`
                    flex size-8 shrink-0 items-center justify-center rounded-full
                    border text-xs font-semibold
                    ${
                      isCurrent
                        ? "border-action bg-action text-action-ink"
                        : isCompleted
                          ? "border-brand/60 bg-brand/15 text-brand-light"
                          : "border-border bg-surface text-text-secondary"
                    }
                  `}
                  aria-hidden="true"
                >
                  {step}
                </span>
                <span className="hidden truncate sm:block">{label}</span>
              </button>
              <span className="sr-only">
                {isCurrent ? t("request.wizard.currentStep") : ""}
              </span>
            </li>
          );
        })}
      </ol>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-surface-raised"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={currentStep}
        aria-label={t("request.wizard.progressLabel")}
      >
        <div
          className="h-full w-full rounded-full bg-brand transition-transform duration-300 motion-reduce:transition-none"
          style={{
            transform: `scaleX(${currentStep / steps.length})`,
            transformOrigin: isRtl ? "right" : "left",
          }}
        />
      </div>
    </nav>
  );
}

export default RequestProgress;
