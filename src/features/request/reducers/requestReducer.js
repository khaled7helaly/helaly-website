import addons from "../../../data/addons.json";
import services from "../../../data/services.json";
import { createRequestInitialState } from "./requestInitialState";
import isAddonCompatible from "../utils/isAddonCompatible";

function retainCompatibleAddons(addonIds, serviceId, categoryId) {
  return [...new Set(addonIds)].filter((addonId) => {
    const addon = addons.find((item) => item.id === addonId);

    return addon && isAddonCompatible(addon, serviceId, categoryId);
  });
}

// Service-specific answers only mean something while their service is chosen,
// so switching service drops the ones the new service never asked for.
function retainServiceFields(serviceFields, service) {
  const allowed = new Set(
    (service?.requestConfig?.extraFields ?? []).map((field) => field.id),
  );

  return Object.fromEntries(
    Object.entries(serviceFields ?? {}).filter(([fieldId]) =>
      allowed.has(fieldId),
    ),
  );
}

function requestReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY": {
      const selectedCategoryId = action.payload ?? "";

      if (selectedCategoryId === state.selectedCategoryId) {
        return state;
      }

      return {
        ...state,
        selectedCategoryId,
        selectedServiceId: "",
        selectedAddonIds: retainCompatibleAddons(
          state.selectedAddonIds,
          "",
          selectedCategoryId,
        ),
      };
    }

    case "SET_SERVICE": {
      const selectedServiceId = action.payload ?? "";
      const service = services.find((item) => item.id === selectedServiceId);
      const selectedCategoryId =
        service?.category ?? state.selectedCategoryId;

      return {
        ...state,
        selectedCategoryId,
        selectedServiceId,
        selectedAddonIds: retainCompatibleAddons(
          state.selectedAddonIds,
          selectedServiceId,
          selectedCategoryId,
        ),
        serviceFields: retainServiceFields(state.serviceFields, service),
      };
    }

    // Arriving from a proposal, which may have already ticked some extras.
    // Service and extras are applied together so the add-ons are checked
    // against the service that is being selected, not the previous one.
    case "SET_SELECTION": {
      const service = services.find(
        (item) => item.id === action.payload?.serviceId,
      );

      if (!service) {
        return state;
      }

      const selectedCategoryId = service.category ?? state.selectedCategoryId;
      const requestedAddonIds = Array.isArray(action.payload.addonIds)
        ? action.payload.addonIds
        : [];

      return {
        ...state,
        selectedCategoryId,
        selectedServiceId: service.id,
        selectedAddonIds: retainCompatibleAddons(
          requestedAddonIds,
          service.id,
          selectedCategoryId,
        ),
        serviceFields: retainServiceFields(state.serviceFields, service),
      };
    }

    case "SET_PROJECT_TYPE":
      return {
        ...state,
        selectedProjectType: action.payload ?? "",
      };

    case "TOGGLE_ADDON": {
      const addonId =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.addonId;

      if (!addonId) {
        return state;
      }

      const addon = addons.find((item) => item.id === addonId);
      if (
        !addon ||
        !isAddonCompatible(
          addon,
          state.selectedServiceId,
          state.selectedCategoryId,
        )
      ) {
        return state;
      }

      const isSelected = state.selectedAddonIds.includes(addonId);

      return {
        ...state,
        selectedAddonIds: isSelected
          ? state.selectedAddonIds.filter((id) => id !== addonId)
          : [...new Set([...state.selectedAddonIds, addonId])],
      };
    }

    case "SET_PROJECT_DESCRIPTION":
      return {
        ...state,
        projectDescription: action.payload ?? "",
      };

    // One action for every service-specific field: the id comes from the JSON
    // config, so a new field needs no new case here.
    case "SET_SERVICE_FIELD": {
      const field = action.payload?.field;

      if (typeof field !== "string" || field.length === 0) {
        return state;
      }

      return {
        ...state,
        serviceFields: {
          ...state.serviceFields,
          [field]: action.payload.value ?? "",
        },
      };
    }

    case "SET_BUDGET": {
      const budget =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { amount: action.payload };

      return {
        ...state,
        budgetAmount:
          budget.amount ?? budget.budgetAmount ?? state.budgetAmount,
        budgetCurrency:
          budget.currency ?? budget.budgetCurrency ?? state.budgetCurrency,
      };
    }

    case "SET_TIMELINE": {
      const timeline =
        typeof action.payload === "object" && action.payload !== null
          ? action.payload
          : { value: action.payload };

      return {
        ...state,
        expectedTimeline: timeline.value ?? "",
        expectedTimelineOther:
          (timeline.value ?? "") === "other"
            ? timeline.other ?? state.expectedTimelineOther
            : "",
      };
    }

    case "SET_CUSTOMER_FIELD": {
      const field = action.payload?.field;

      if (!Object.hasOwn(state.customer, field)) {
        return state;
      }

      return {
        ...state,
        customer: {
          ...state.customer,
          [field]: action.payload.value ?? "",
        },
      };
    }

    case "RESET_REQUEST":
      return createRequestInitialState();

    default:
      return state;
  }
}

export default requestReducer;
