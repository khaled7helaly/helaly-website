import { useTranslation } from "react-i18next";

import FormField from "../../../components/ui/FormField";
import useRequestBuilder from "../hooks/useRequestBuilder";

/**
 * `required` drives both the visual marker and the screen-reader "Required"
 * note in FormField, so the two contacts we genuinely need are the only ones
 * marked — the email stays clearly optional.
 */
const FIELDS = [
  {
    name: "fullName",
    type: "text",
    autoComplete: "name",
    required: true,
  },
  {
    name: "whatsapp",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
    required: true,
    helperTextKey: "request.customer.whatsappHelper",
  },
  {
    name: "email",
    type: "email",
    autoComplete: "email",
    required: false,
    helperTextKey: "request.customer.emailHelper",
  },
];

function CustomerDetailsForm({ validationErrors = [] }) {
  const { t } = useTranslation();
  const { state, dispatch } = useRequestBuilder();

  return (
    <section aria-label={t("request.wizard.steps.step3.title")}>
      <div className="grid gap-5 md:grid-cols-2">
        {FIELDS.map(({ name, helperTextKey, ...fieldProps }) => (
          <FormField
            key={name}
            {...fieldProps}
            name={name}
            labelKey={`request.customer.${name}`}
            placeholderKey={`request.customer.${name}Placeholder`}
            helperTextKey={helperTextKey}
            errorKey={
              validationErrors.find((error) => error.field === name)
                ?.messageKey
            }
            value={state.customer[name]}
            onChange={(event) =>
              dispatch({
                type: "SET_CUSTOMER_FIELD",
                payload: { field: name, value: event.target.value },
              })
            }
          />
        ))}
      </div>
    </section>
  );
}

export default CustomerDetailsForm;
