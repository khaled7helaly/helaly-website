/**
 * Step 1 validates the category and the service separately, because the
 * reducer can legitimately hold one without the other. The wizard now picks
 * both in a single action, so reporting two messages for one unanswered step
 * is noise — the service message is the one the customer can act on.
 *
 * Shared by the step and the wizard's error summary so the two never show
 * different sets of problems.
 */
export default function getDisplayErrors(errors = []) {
  const hasServiceError = errors.some(
    (error) => error.field === "selectedServiceId",
  );

  return hasServiceError
    ? errors.filter((error) => error.field !== "selectedCategoryId")
    : errors;
}
