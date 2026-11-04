import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpenIds = [],
  className = "",
  itemClassName = "",
}) {
  const { t } = useTranslation();
  const generatedId = useId();

  const [openIds, setOpenIds] = useState(() =>
    allowMultiple ? defaultOpenIds : defaultOpenIds.slice(0, 1)
  );

  const toggleItem = (id) => {
    setOpenIds((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      return allowMultiple ? [...current, id] : [id];
    });
  };

  if (!items.length) return null;

  return (
    <div className={`w-full divide-y divide-border ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);

        const triggerId = `${generatedId}-${index}-trigger`;
        const panelId = `${generatedId}-${index}-panel`;

        return (
          <div
            key={item.id}
            className={`py-5 ${itemClassName}`}
          >
            <button
              id={triggerId}
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="
                group flex w-full items-center justify-between gap-4
                text-start text-text-primary
                transition-colors duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand
                focus-visible:ring-offset-4
                focus-visible:ring-offset-background
              "
            >
              <span className="text-base font-semibold sm:text-lg">
                {t(item.questionKey)}
              </span>

              <ChevronDown
                size={20}
                className={`
                  shrink-0 text-text-secondary
                  transition-[transform,color] duration-300
                  group-hover:text-brand-light
                  ${isOpen ? "rotate-180" : ""}
                `}
                aria-hidden="true"
              />
            </button>

            {/*
              The panel stays mounted so the row can animate, which means it
              must be removed from the accessibility tree and the tab order
              while collapsed: `inert` covers both.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pt-4 whitespace-pre-line text-sm leading-relaxed text-text-secondary sm:text-base">
                  {t(item.answerKey)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;