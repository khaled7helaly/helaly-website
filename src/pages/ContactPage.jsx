import { useTranslation } from "react-i18next";
import PagePlaceholder from "../components/ui/PagePlaceholder";

function ContactPage() {
  const { t } = useTranslation();

  return <PagePlaceholder title={t("common.contact")} />;
}

export default ContactPage;