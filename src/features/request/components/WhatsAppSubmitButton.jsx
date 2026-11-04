import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

import Button from "../../../components/ui/Button";
import contact from "../../../config/contact";
import buildWhatsAppMessage from "../utils/buildWhatsAppMessage";
import validateRequest from "../utils/validateRequest";
import useRequestBuilder from "../hooks/useRequestBuilder";

function WhatsAppSubmitButton() {
  const { t, i18n } = useTranslation();
  const { state } = useRequestBuilder();
  const [validationErrors, setValidationErrors] = useState([]);
  const [isPreparing, setIsPreparing] = useState(false);
  const clickLocked = useRef(false);

  const handleSubmit = () => {
    if (clickLocked.current) {
      return;
    }

    const validation = validateRequest(state);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const businessNumber = contact.whatsappBusinessNumber;
    if (!/^\d+$/.test(businessNumber ?? "")) {
      setValidationErrors([
        {
          field: "destination",
          messageKey: "request.whatsapp.validation.destinationUnavailable",
        },
      ]);
      return;
    }

    setValidationErrors([]);
    clickLocked.current = true;
    setIsPreparing(true);

    const message = buildWhatsAppMessage({
      state,
      t,
      language: i18n.resolvedLanguage,
    });
    const whatsappUrl =
      `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      clickLocked.current = false;
      setIsPreparing(false);
    }, 1000);
  };

  return (
    <div className="mt-6">
      {/* Deliberately states what happens next instead of congratulating the
          customer: `wa.me` cannot report whether the message was ever sent. */}
      <p className="mb-4 text-sm text-text-secondary">
        {t("request.whatsapp.instructions")}
      </p>

      {validationErrors.length > 0 && (
        <ul
          role="alert"
          className="mb-4 space-y-1 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200"
        >
          {validationErrors.map((error) => (
            <li key={error.field}>{t(error.messageKey)}</li>
          ))}
        </ul>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isPreparing}
        aria-busy={isPreparing}
        size="lg"
        className="w-full justify-center sm:w-auto"
      >
        <MessageCircle size={18} aria-hidden="true" />
        {t(
          isPreparing
            ? "request.whatsapp.preparing"
            : "request.whatsapp.submit",
        )}
      </Button>
    </div>
  );
}

export default WhatsAppSubmitButton;