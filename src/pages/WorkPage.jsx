import { useTranslation } from "react-i18next";

import Container from "../components/ui/Container";
import SectionHeading from "../components/ui/SectionHeading";
import ProjectGrid from "../features/projects/components/ProjectGrid";

function WorkPage() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          title={t("work.pageTitle")}
          description={t("work.pageDescription")}
          className="mb-8"
        />
        <ProjectGrid />
      </Container>
    </section>
  );
}

export default WorkPage;