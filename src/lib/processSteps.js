import { ClipboardList, Code, Package, PanelsTopLeft, Search } from "lucide-react";

import PROCESS_STEPS from "../data/processSteps.json";

// processSteps.json stores icon names as plain strings so the data stays valid
// JSON. They are resolved to components here: rendering a string as JSX produces
// an unknown DOM tag rather than an icon.
const STEP_ICONS = {
  search: Search,
  clipboard: ClipboardList,
  panels: PanelsTopLeft,
  code: Code,
  package: Package,
};

/** The shared process, ordered and icon-mapped. */
export const ORDERED_PROCESS_STEPS = [...PROCESS_STEPS]
  .sort((firstStep, secondStep) => firstStep.order - secondStep.order)
  .map((step) => ({ ...step, Icon: STEP_ICONS[step.icon] ?? Search }));

/**
 * Resolves a service's `processStepIds` against the shared process.
 *
 * The result keeps the canonical process order rather than the order the ids
 * happen to be listed in, and unknown ids are dropped, so a stale reference
 * narrows the section instead of breaking it.
 *
 * @param {string[] | undefined} stepIds
 *   When omitted or empty the full process is returned, because a service that
 *   does not narrow the stages still follows the studio's process.
 * @returns {typeof ORDERED_PROCESS_STEPS}
 */
export function getProcessSteps(stepIds) {
  if (!Array.isArray(stepIds) || stepIds.length === 0) {
    return ORDERED_PROCESS_STEPS;
  }

  const wantedIds = new Set(stepIds);

  return ORDERED_PROCESS_STEPS.filter((step) => wantedIds.has(step.id));
}
