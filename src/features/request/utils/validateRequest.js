import categories from "../../../data/serviceCategories.json";
import services from "../../../data/services.json";

function validateRequest(state, step) {
  const errors = [];
  // Three steps: 1 service and project, 2 budget and timeline, 3 contact.
  const steps = step == null ? [1, 2, 3] : [step];

  if (steps.includes(1)) {
    const service = services.find(
      (item) => item.id === state.selectedServiceId,
    );
    const category = categories.find(
      (item) => item.id === state.selectedCategoryId,
    );

    if (!category) {
      errors.push({
        field: "selectedCategoryId",
        messageKey: "request.whatsapp.validation.categoryRequired",
      });
    }

    if (!service || service.category !== state.selectedCategoryId) {
      errors.push({
        field: "selectedServiceId",
        messageKey: "request.whatsapp.validation.serviceRequired",
      });
    }
  }

  if (steps.includes(2)) {
    if (String(state.budgetAmount ?? "").trim()) {
      const budget = Number(state.budgetAmount);
      if (!Number.isFinite(budget) || budget < 0) {
        errors.push({
          field: "budgetAmount",
          messageKey: "request.whatsapp.validation.budgetInvalid",
        });
      }
    }

    // "Other" without a description used to reach the message as a bare
    // "Other", which is useless to whoever reads it.
    if (
      state.expectedTimeline === "other" &&
      !String(state.expectedTimelineOther ?? "").trim()
    ) {
      errors.push({
        field: "expectedTimelineOther",
        messageKey: "request.whatsapp.validation.otherTimelineRequired",
      });
    }
  }

  if (steps.includes(3)) {
    if (!state.customer.fullName.trim()) {
      errors.push({
        field: "fullName",
        messageKey: "request.whatsapp.validation.nameRequired",
      });
    }

    if (!state.customer.whatsapp.trim()) {
      errors.push({
        field: "whatsapp",
        messageKey: "request.whatsapp.validation.whatsappRequired",
      });
    }

    if (
      state.customer.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(state.customer.email.trim())
    ) {
      errors.push({
        field: "email",
        messageKey: "request.whatsapp.validation.emailInvalid",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default validateRequest;