import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

import Button from "../../../components/ui/Button";
import FormField from "../../../components/ui/FormField";
import SelectField from "../../../components/ui/SelectField";
import TextAreaField from "../../../components/ui/TextAreaField";
import contact from "../../../config/contact";
import optionGroups from "../../../data/packageFieldOptions.json";
import { resolveFieldOptions } from "../utils/packageData";
import calculatePackagePrice from "../utils/calculatePackagePrice";
import buildPackageWhatsAppMessage from "../utils/buildPackageWhatsAppMessage";
import validatePackageInquiry from "../utils/validatePackageInquiry";
import PackageAddons from "./PackageAddons";
import PackagePriceSummary from "./PackagePriceSummary";

/*
  Short, package-specific inquiry form — the only order path for a fixed package.

  Honesty rules enforced here:
  - `wa.me` cannot report whether a message was actually sent, so the success
    line says the request is *ready* and asks the customer to finish in WhatsApp.
    Nothing claims an order was placed, paid for or confirmed.
  - When the WhatsApp destination is not a configured number the final action is
    disabled and the form stays readable instead of silently doing nothing.
  - No payment step exists, because there is no payment integration.
*/

function PackageInquiryForm({ record }) {
  const { t, i18n } = useTranslation();

  const [values, setValues] = useState({
    fullName: "",
    whatsapp: "",
    notes: "",
  });
  const [answers, setAnswers] = useState({});
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("idle");
  const clickLocked = useRef(false);

  const price = useMemo(
    () => calculatePackagePrice(record, selectedAddonIds),
    [record, selectedAddonIds],
  );

  const errorByField = useMemo(() => {
    const map = new Map();
    for (const error of errors) {
      if (!map.has(error.field)) map.set(error.field, error.messageKey);
    }
    return map;
  }, [errors]);

  const destination = contact.whatsappBusinessNumber;
  const destinationConfigured = /^\d+$/.test(destination ?? "");
  const isPreparing = status === "preparing";

  const updateValue = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const updateAnswer = (fieldId) => (event) =>
    setAnswers((current) => ({ ...current, [fieldId]: event.target.value }));

  const toggleAddon = (addonId) =>
    setSelectedAddonIds((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId],
    );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (clickLocked.current || isPreparing) return;

    const state = {
      packageId: record.id,
      fullName: values.fullName,
      whatsapp: values.whatsapp,
      notes: values.notes,
      answers,
    };

    const validation = validatePackageInquiry(record, state);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    if (!destinationConfigured) {
      setErrors([]);
      setStatus("blocked");
      return;
    }

    setErrors([]);
    setStatus("preparing");
    clickLocked.current = true;

    const message = buildPackageWhatsAppMessage({
      record,
      state,
      price,
      t,
      optionGroups,
      language: i18n.resolvedLanguage,
    });

    const url = `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      clickLocked.current = false;
      setStatus("ready");
    }, 1000);
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              name="fullName"
              labelKey="packages.form.fullName"
              placeholderKey="packages.form.fullNamePlaceholder"
              value={values.fullName}
              onChange={updateValue("fullName")}
              autoComplete="name"
              required
              errorKey={errorByField.get("fullName")}
            />

            <FormField
              name="whatsapp"
              type="tel"
              labelKey="packages.form.whatsapp"
              placeholderKey="packages.form.whatsappPlaceholder"
              helperTextKey="packages.form.whatsappHelper"
              value={values.whatsapp}
              onChange={updateValue("whatsapp")}
              autoComplete="tel"
              required
              errorKey={errorByField.get("whatsapp")}
            />
          </div>

          {record.fields.map((field) => {
            const errorKey = errorByField.get(field.id);

            if (field.type === "select") {
              return (
                <SelectField
                  key={field.id}
                  name={field.id}
                  labelKey={field.labelKey}
                  placeholderKey="packages.form.selectPlaceholder"
                  options={resolveFieldOptions(field, optionGroups)}
                  value={answers[field.id] ?? ""}
                  onChange={updateAnswer(field.id)}
                  required={field.required}
                  errorKey={errorKey}
                />
              );
            }

            if (field.type === "textarea") {
              return (
                <TextAreaField
                  key={field.id}
                  name={field.id}
                  labelKey={field.labelKey}
                  value={answers[field.id] ?? ""}
                  onChange={updateAnswer(field.id)}
                  required={field.required}
                  errorKey={errorKey}
                />
              );
            }

            return (
              <FormField
                key={field.id}
                name={field.id}
                type={field.type === "url" ? "url" : field.type}
                labelKey={field.labelKey}
                value={answers[field.id] ?? ""}
                onChange={updateAnswer(field.id)}
                required={field.required}
                errorKey={errorKey}
              />
            );
          })}

          <TextAreaField
            name="notes"
            labelKey="packages.form.notes"
            placeholderKey="packages.form.notesPlaceholder"
            helperTextKey="packages.form.optional"
            value={values.notes}
            onChange={updateValue("notes")}
            rows={4}
          />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <PackageAddons
            record={record}
            selectedIds={selectedAddonIds}
            onToggle={toggleAddon}
          />

          <PackagePriceSummary record={record} price={price} />
        </aside>
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200"
        >
          <p className="font-semibold">{t("packages.form.errorsTitle")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error.field}>{t(error.messageKey)}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "blocked" && (
        <p
          role="alert"
          className="mt-8 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-text-primary"
        >
          {t("packages.form.destinationUnavailable")}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={isPreparing || !destinationConfigured}
          aria-busy={isPreparing}
          className="w-full justify-center sm:w-auto"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {t(
            isPreparing ? "packages.form.preparing" : "packages.form.submit",
          )}
        </Button>

        {/* Restates what the button does, so the flow is never mistaken for a
            completed order. */}
        <p className="text-sm text-text-secondary">
          {t("packages.form.reviewNote")}
        </p>

        {status === "ready" && (
          <p
            aria-live="polite"
            className="rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm text-text-primary"
          >
            {t("packages.form.instructions")}
          </p>
        )}
      </div>
    </form>
  );
}

export default PackageInquiryForm;
