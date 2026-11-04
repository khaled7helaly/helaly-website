import { useTranslation } from "react-i18next";
import PagePlaceholder from "../components/ui/PagePlaceholder";

function AboutPage() {
  const { t } = useTranslation();

  return <PagePlaceholder title={t("about.pageTitle")} />;
}

export default AboutPage;