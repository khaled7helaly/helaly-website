import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import ProjectGrid from "../../projects/components/ProjectGrid";

function SelectedProjects() {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden border-t border-border py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Title on the start side, "view all" on the end side (stacked on mobile). */}
        <div className="mb-14 flex flex-col gap-8 sm:mb-16 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <SectionHeading
            eyebrow={t("common.work")}
            title={t("home.projectsTitle")}
            description={t("home.projectsDescription")}
            className="max-w-2xl"
          />
           <Link
            to="/work"
            className="shrink-0 self-start rounded-sm text-sm font-semibold text-text-primary underline decoration-text-secondary decoration-1 underline-offset-8 transition-colors duration-200 hover:decoration-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:self-auto"
          >
            {t("common.viewAllProjects")}
          </Link>
        </div>

        <ProjectGrid limit={3} featuredOnly layout="showcase" />
      </Container>
    </section>
  );
}

export default SelectedProjects;
