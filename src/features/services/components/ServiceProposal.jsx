import { ArrowUpRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Button from "../../../components/ui/Button";
import Checkbox from "../../../components/ui/Checkbox";
import Container from "../../../components/ui/Container";
import StartingPrice from "../../../components/ui/StartingPrice";
import addons from "../../../data/addons.json";
import readTranslation from "../../../lib/readTranslation";
import buildRequestUrl from "../../request/utils/buildRequestUrl";
import isAddonCompatible from "../../request/utils/isAddonCompatible";
import { getProposalByServiceSlug } from "../utils/proposals";

/**
 * Per-service proposal, presented as a paper document rather than a card.
 *
 * The content is entirely data-driven: `proposals.json` decides which sections
 * exist and in which order, while the strings live in the locale files so both
 * languages stay symmetrical. A proposal with `status: "outline"` is not
 * rendered at all — an unfinished document would show section titles with no
 * content behind them, so the service page simply ends without it.
 *
 * Two of the sections are interactive rather than written: the optional extras
 * come from `addons.json` and the pricing clause states the service's starting
 * price. Extras are never priced individually and never added up here — the
 * document states that the quotation follows the customer's requirements, and
 * the ticked extras are carried into the request instead.
 */

const EASE = [0.22, 1, 0.36, 1];

/** Reads an array-valued i18n key, returning `[]` when it is missing. */
function readList(t, key) {
  if (typeof key !== "string" || key.length === 0) {
    return [];
  }

  const value = t(key, { returnObjects: true, defaultValue: [] });
  return Array.isArray(value) ? value : [];
}

function ProseBody({ bodyKey }) {
  const { t } = useTranslation();
  const body = readTranslation(t, bodyKey);

  if (!body) {
    return null;
  }

  return (
    <p className="max-w-[68ch] text-body leading-[1.8] whitespace-pre-line text-text-secondary">
      {body}
    </p>
  );
}

function ListBody({ itemsKey }) {
  const { t } = useTranslation();
  const items = readList(t, itemsKey);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand/70"
          />
          <span className="text-body leading-[1.75] text-text-secondary">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PairsBody({ itemsKey }) {
  const { t } = useTranslation();
  const items = readList(t, itemsKey);

  if (items.length === 0) {
    return null;
  }

  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="border-t border-border pt-4">
          <dt className="text-small font-semibold text-text-primary">
            {item.title}
          </dt>
          <dd className="mt-1.5 text-small leading-[1.7] text-text-secondary">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Only a confirmed starting amount in a named currency can be shown. */
function hasStartingPrice(item) {
  return (
    item?.startingPrice != null &&
    Number.isFinite(item.startingPrice) &&
    item.startingPrice >= 0 &&
    Boolean(item.currency)
  );
}

/** The extras the customer can add. They are carried into the request, unpriced. */
function AddonsBody({ options }) {
  const { t } = useTranslation();
  const { availableAddons, selectedAddonIds, onToggleAddon } = options;

  if (availableAddons.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="max-w-[68ch] text-body leading-[1.8] text-text-secondary">
        {t("services.proposal.options.note")}
      </p>

      <ul className="mt-5 grid gap-3">
        {availableAddons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);

          return (
            <li
              key={addon.id}
              className={`rounded-xl border p-4 transition-colors duration-200 ${
                isSelected
                  ? "border-brand bg-brand/[0.07]"
                  : "border-border bg-surface-raised hover:border-brand/50"
              }`}
            >
              <Checkbox
                name="proposal-addons"
                value={addon.id}
                labelKey={addon.titleKey}
                descriptionKey={addon.descriptionKey}
                checked={isSelected}
                onChange={() => onToggleAddon(addon.id)}
                className="min-w-0"
              />
            </li>
          );
        })}
      </ul>

      <p className="mt-5 max-w-[68ch] text-small leading-[1.7] text-text-secondary">
        {t("pricing.customQuote")}
      </p>
    </div>
  );
}

/**
 * The document's only money statement.
 *
 * It prints the service's starting price and says plainly that the quotation
 * follows the customer's requirements. There is deliberately no extras list and
 * no total: nothing here can be summed before the scope is reviewed.
 */
function PricingBody({ options }) {
  const { t } = useTranslation();
  const { service } = options;

  return (
    <div className="max-w-[68ch]">
      {hasStartingPrice(service) ? (
        <StartingPrice
          amount={service.startingPrice}
          currency={service.currency}
          className="text-body"
        />
      ) : null}

      <p className="mt-4 text-body leading-[1.8] text-text-secondary">
        {t("pricing.customQuote")}
      </p>
    </div>
  );
}

function SectionBody({ section, options }) {
  if (section.type === "list") {
    return <ListBody itemsKey={section.itemsKey} />;
  }

  if (section.type === "pairs") {
    return <PairsBody itemsKey={section.itemsKey} />;
  }

  if (section.type === "addons") {
    return <AddonsBody options={options} />;
  }

  if (section.type === "pricing") {
    return <PricingBody options={options} />;
  }

  return <ProseBody bodyKey={section.bodyKey} />;
}

function SectionNumber({ value }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 text-small font-semibold tabular-nums text-brand-light"
    >
      {String(value).padStart(2, "0")}
    </span>
  );
}

/** Full document body: numbered sections with their content beside the title. */
function ProposalDocument({ sections, options }) {
  const { t } = useTranslation();

  return (
    <div className="divide-y divide-border">
      {sections.map((section, index) => {
        const isHighlighted = section.tone === "highlight";

        return (
          <section
            key={section.id}
            className={`grid gap-4 px-6 py-8 sm:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] sm:gap-10 sm:px-10 sm:py-10 ${
              isHighlighted ? "bg-brand/[0.035]" : ""
            }`}
          >
            <h3 className="flex items-baseline gap-3 text-small font-semibold tracking-[0.02em] text-text-primary">
              <SectionNumber value={index + 1} />
              {t(section.titleKey)}
            </h3>

            <div>
              <SectionBody section={section} options={options} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ServiceProposal({ service }) {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [selectedAddonIds, setSelectedAddonIds] = useState([]);

  const proposal = getProposalByServiceSlug(service?.slug);

  if (!proposal || proposal.status !== "complete") {
    return null;
  }

  // The extras offered here are the same records the request wizard uses,
  // narrowed to the ones that fit this service, so nothing picked here can be
  // dropped later for being incompatible.
  const availableAddons = addons
    .filter((addon) => isAddonCompatible(addon, service.id, service.category))
    .sort((first, second) => first.order - second.order);

  const options = {
    service,
    availableAddons,
    selectedAddonIds,
    onToggleAddon: (addonId) =>
      setSelectedAddonIds((current) =>
        current.includes(addonId)
          ? current.filter((id) => id !== addonId)
          : [...current, addonId],
      ),
  };

  const headline = readTranslation(t, proposal.headlineKey);
  const intro = readTranslation(t, proposal.introKey);
  const wantsSimilarProject = proposal.actions?.includes("similar");

  return (
    <section
      id="proposal"
      aria-labelledby="service-proposal-title"
      className="scroll-mt-24 border-t border-border py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <motion.article
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_1px_0_0_var(--border)]"
        >
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-border px-6 py-7 sm:px-10 sm:py-9">
            <div className="min-w-0 max-w-2xl">
              <p className="inline-flex items-center gap-2 text-small font-semibold tracking-[0.22em] text-brand-light uppercase rtl:normal-case rtl:tracking-normal">
                <FileText aria-hidden="true" className="size-4" />
                {t("services.proposal.documentLabel")}
              </p>

              {/* The headline leads the document: it sells the result before
                  the sections explain how it is reached. */}
              <h2
                id="service-proposal-title"
                className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-bold tracking-tight text-balance text-text-primary rtl:leading-[1.3] rtl:tracking-normal"
              >
                {headline}
              </h2>

              {intro ? (
                <p className="mt-4 max-w-[58ch] text-body leading-[1.75] text-text-secondary">
                  {intro}
                </p>
              ) : null}
            </div>

            <p className="shrink-0 text-small text-text-secondary">
              {t("services.proposal.referenceLabel")}
              <span className="ms-2 font-semibold tabular-nums text-text-primary">
                {proposal.reference}
              </span>
            </p>
          </header>

          <ProposalDocument sections={proposal.sections} options={options} />

          <footer className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-7 sm:px-10 sm:py-8">
            <Button
              as={Link}
              to={buildRequestUrl(service.slug, selectedAddonIds)}
              size="lg"
            >
              {t("services.proposal.actions.request")}
              <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </Button>

            {wantsSimilarProject ? (
              <Button
                as={Link}
                to={buildRequestUrl(service.slug, selectedAddonIds)}
                variant="outline"
                size="lg"
              >
                {t("services.proposal.actions.similar")}
              </Button>
            ) : null}
          </footer>
        </motion.article>
      </Container>
    </section>
  );
}

export default ServiceProposal;
