import { useTranslation } from "react-i18next";

import FormField from "../../../components/ui/FormField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import services from "../../../data/services.json";
import requestOptions from "../../../data/requestOptions.json";
import useRequestBuilder from "../hooks/useRequestBuilder";

const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Everything the service needs to know about the project.
 *
 * The fields come from the chosen service's `requestConfig`, so a wedding site
 * can ask for a date and a store for a product count without this component
 * knowing either exists. Nothing here is required: the only things the wizard
 * insists on are the service itself and a way to reply.
 */
function ServiceExtraField({ field }) {
  const { state, dispatch } = useRequestBuilder();

  const value = state.serviceFields?.[field.id] ?? "";
  const onChange = (event) =>
    dispatch({
      type: "SET_SERVICE_FIELD",
      payload: { field: field.id, value: event.target.value },
    });

  if (field.type === "textarea") {
    return (
      <TextAreaField
        name={field.id}
        labelKey={field.labelKey}
        helperTextKey={field.helperTextKey}
        value={value}
        onChange={onChange}
        rows={4}
      />
    );
  }

  return (
    <FormField
      name={field.id}
      type={field.type ?? "text"}
      labelKey={field.labelKey}
      helperTextKey={field.helperTextKey}
      value={value}
      onChange={onChange}
    />
  );
}

function ProjectDetailsForm() {
  const { t } = useTranslation();
  const { state, dispatch } = useRequestBuilder();

  const service =
    services.find((item) => item.id === state.selectedServiceId) ?? null;
  const config = service?.requestConfig ?? {};
  const optionalFields = config.optionalFields ?? [];
  const extraFields = config.extraFields ?? [];

  const sectionHeading = (
    <h3 className="text-xs font-semibold tracking-[0.16em] text-text-secondary uppercase rtl:normal-case rtl:tracking-normal">
      {t("request.wizard.projectSectionTitle")}
    </h3>
  );

  return (
    <section aria-label={t("request.wizard.projectSectionTitle")}>
      {sectionHeading}
      <div className="mt-4 grid gap-5">
        {optionalFields.includes("projectType") ? (
          <SelectField
            name="projectType"
            labelKey="request.projectDetails.projectTypeLabel"
            placeholderKey="request.projectDetails.projectTypePlaceholder"
            helperTextKey="request.projectDetails.optionalHint"
            options={requestOptions.projectTypes}
            value={state.selectedProjectType}
            onChange={(event) =>
              dispatch({ type: "SET_PROJECT_TYPE", payload: event.target.value })
            }
          />
        ) : null}

        <div>
          <TextAreaField
            name="projectDescription"
            labelKey="request.projectDetails.descriptionLabel"
            placeholderKey="request.projectDetails.descriptionPlaceholder"
            helperTextKey={
              config.descriptionPromptKey ??
              "request.projectDetails.descriptionHelper"
            }
            value={state.projectDescription}
            onChange={(event) =>
              dispatch({
                type: "SET_PROJECT_DESCRIPTION",
                payload: event.target.value,
              })
            }
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={6}
          />

          <p
            aria-live="polite"
            className="mt-2 text-end text-xs text-text-secondary"
          >
            {t("request.projectDetails.descriptionCounter", {
              current: state.projectDescription.length,
              max: MAX_DESCRIPTION_LENGTH,
            })}
          </p>
        </div>

        {extraFields.map((field) => (
          <ServiceExtraField key={field.id} field={field} />
        ))}
      </div>
    </section>
  );
}

export default ProjectDetailsForm;
