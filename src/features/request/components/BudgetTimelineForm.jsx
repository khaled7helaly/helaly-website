import FormField from "../../../components/ui/FormField";
import SelectField from "../../../components/ui/SelectField";
import requestOptions from "../../../data/requestOptions.json";
import useRequestBuilder from "../hooks/useRequestBuilder";

function BudgetTimelineForm({ validationErrors = [] }) {
  const { state, dispatch } = useRequestBuilder();
  const budgetError = validationErrors.find(
    (error) => error.field === "budgetAmount",
  );
  const timelineOtherError = validationErrors.find(
    (error) => error.field === "expectedTimelineOther",
  );

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormField
        name="budgetAmount"
        type="number"
        labelKey="request.projectDetails.budgetLabel"
        placeholderKey="request.projectDetails.budgetPlaceholder"
        helperTextKey="request.projectDetails.budgetHelper"
        value={state.budgetAmount}
        errorKey={budgetError?.messageKey}
        min="0"
        step="any"
        inputMode="decimal"
        onChange={(event) =>
          dispatch({
            type: "SET_BUDGET",
            payload: {
              amount: event.target.value,
              currency: state.budgetCurrency,
            },
          })
        }
      />

      <SelectField
        name="budgetCurrency"
        labelKey="request.projectDetails.currencyLabel"
        placeholderKey="request.projectDetails.currencyPlaceholder"
        helperTextKey="request.projectDetails.currencyHelper"
        options={requestOptions.currencies}
        value={state.budgetCurrency}
        onChange={(event) =>
          dispatch({
            type: "SET_BUDGET",
            payload: {
              amount: state.budgetAmount,
              currency: event.target.value,
            },
          })
        }
      />

      <div className="md:col-span-2">
        <SelectField
          name="expectedTimeline"
          labelKey="request.projectDetails.timelineLabel"
          placeholderKey="request.projectDetails.timelinePlaceholder"
          helperTextKey="request.projectDetails.timelineHelper"
          options={requestOptions.timelines}
          value={state.expectedTimeline}
          onChange={(event) =>
            dispatch({
              type: "SET_TIMELINE",
              payload: {
                value: event.target.value,
                other:
                  event.target.value === "other"
                    ? state.expectedTimelineOther
                    : "",
              },
            })
          }
        />
        {state.expectedTimeline === "other" && (
          <FormField
            name="expectedTimelineOther"
            labelKey="request.projectDetails.otherTimelineLabel"
            placeholderKey="request.projectDetails.otherTimelinePlaceholder"
            value={state.expectedTimelineOther}
            errorKey={timelineOtherError?.messageKey}
            onChange={(event) =>
              dispatch({
                type: "SET_TIMELINE",
                payload: {
                  value: state.expectedTimeline,
                  other: event.target.value,
                },
              })
            }
            maxLength={100}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
}

export default BudgetTimelineForm;
