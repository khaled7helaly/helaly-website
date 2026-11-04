import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";

import Button from "./Button";

function EmptyState({
  titleKey = "common.emptyState.title",
  descriptionKey = "common.emptyState.description",
  actionLabelKey = "common.emptyState.action",
  actionTo,
  icon,
  className = "",
}) {
  const { t } = useTranslation();
  const displayIcon = icon ?? <Inbox size={28} aria-hidden="true" />;

  return (
    <section
      role="status"
      className={`
        flex w-full flex-col items-center justify-center
        rounded-2xl border border-border
        bg-surface px-6 py-12 text-center
        ${className}
      `}
    >
      <div
        aria-hidden="true"
        className="mb-5 flex size-14 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-brand-bright"
      >
        {displayIcon}
      </div>

      <h3 className="text-heading-md font-bold text-text-primary">
        {t(titleKey)}
      </h3>

      <p className="mt-3 max-w-md text-body text-text-secondary">
        {t(descriptionKey)}
      </p>

      {actionTo && actionLabelKey && (
        <Button
          as={Link}
          to={actionTo}
          className="mt-6"
        >
          {t(actionLabelKey)}
        </Button>
      )}
    </section>
  );
}

export default EmptyState;