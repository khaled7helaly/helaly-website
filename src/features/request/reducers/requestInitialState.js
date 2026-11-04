export function createRequestInitialState() {
  return {
    selectedCategoryId: "",
    selectedServiceId: "",
    selectedProjectType: "",
    selectedAddonIds: [],
    projectDescription: "",
    // Answers to the fields a specific service asks for (see
    // `requestConfig.extraFields` in services.json). Keyed by field id so one
    // map serves every service instead of a schema per form.
    serviceFields: {},
    budgetAmount: "",
    budgetCurrency: "",
    expectedTimeline: "",
    expectedTimelineOther: "",
    customer: {
      fullName: "",
      whatsapp: "",
      email: "",
    },
  };
}

export const requestInitialState = createRequestInitialState();

export default requestInitialState;
