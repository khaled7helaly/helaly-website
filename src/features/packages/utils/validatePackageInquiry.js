/**
 * Validates a package inquiry before the WhatsApp message is built.
 *
 * Only the shared fields and the package's own required fields are checked —
 * everything else on the form is genuinely optional, so nothing is demanded
 * that the customer did not already agree to provide.
 *
 * @typedef {import("./packageData").PackageRecord} PackageRecord
 *
 * @typedef {object} PackageInquiryState
 * @property {string} packageId
 * @property {string} fullName
 * @property {string} whatsapp
 * @property {string} notes
 * @property {Record<string, string>} answers
 *
 * @param {PackageRecord | null} record
 * @param {PackageInquiryState} state
 * @returns {{ isValid: boolean, errors: { field: string, messageKey: string }[] }}
 */
export default function validatePackageInquiry(record, state) {
  const errors = [];
  const answers = state?.answers ?? {};

  if (!record) {
    return {
      isValid: false,
      errors: [
        { field: "packageId", messageKey: "packages.form.errors.packageRequired" },
      ],
    };
  }

  if (!String(state?.fullName ?? "").trim()) {
    errors.push({
      field: "fullName",
      messageKey: "packages.form.errors.nameRequired",
    });
  }

  if (!String(state?.whatsapp ?? "").trim()) {
    errors.push({
      field: "whatsapp",
      messageKey: "packages.form.errors.whatsappRequired",
    });
  }

  for (const field of record.fields ?? []) {
    const value = String(answers[field.id] ?? "").trim();

    if (field.required && !value) {
      errors.push({
        field: field.id,
        messageKey: "packages.form.errors.fieldRequired",
      });
      continue;
    }

    if (field.type === "url" && value && !/^https?:\/\//iu.test(value)) {
      errors.push({
        field: field.id,
        messageKey: "packages.form.errors.urlInvalid",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
