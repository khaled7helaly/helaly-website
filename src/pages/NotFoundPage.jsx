import { useTranslation } from "react-i18next";
import PagePlaceholder from "../components/ui/PagePlaceholder";

function NotFoundPage() {
  const { t } = useTranslation();

  return <PagePlaceholder title={t("errors.notFoundTitle")} />;
}

export default NotFoundPage;