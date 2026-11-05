import {
  ArchitectureMotif,
  BroadcastMotif,
  ConversionMotif,
  DocumentMotif,
  EditorialMotif,
  FlowMotif,
  FocusMotif,
  FramesMotif,
  FunnelMotif,
  LatticeMotif,
  LayersMotif,
  OrbitMotif,
  OverlayMotif,
  PanelsMotif,
  ScatterMotif,
  SignalMotif,
  WireframeMotif,
} from "./heroMotifs";

/** Motif ids are the keys used by the composition table below. */
const HERO_MOTIFS = {
  architecture: ArchitectureMotif,
  broadcast: BroadcastMotif,
  conversion: ConversionMotif,
  document: DocumentMotif,
  editorial: EditorialMotif,
  flow: FlowMotif,
  focus: FocusMotif,
  frames: FramesMotif,
  funnel: FunnelMotif,
  lattice: LatticeMotif,
  layers: LayersMotif,
  orbit: OrbitMotif,
  overlay: OverlayMotif,
  panels: PanelsMotif,
  scatter: ScatterMotif,
  signal: SignalMotif,
  wireframe: WireframeMotif,
};

/**
 * Per-service hero backdrop compositions.
 *
 * The backdrop is data-driven: a service picks a motif plus its own bloom
 * anchors and grid rhythm, so two services never share an identical backdrop
 * even when they belong to the same category. The table is keyed by the real
 * `slug` values in src/data/services.json — no service is invented here, and an
 * unknown slug falls back to its category, then to a neutral default.
 *
 * Values are plain CSS values so they can be dropped straight into the custom
 * properties the backdrop reads (--hero-bloom-x, --hero-grid-size, ...).
 */
export const SERVICE_HERO_COMPOSITIONS = {
  // Web development
  "portfolio-website": { motif: "editorial", bloomX: 34, bloom2X: 72, bloomY: 26, bloom2Y: 72, gridSize: 104 },
  "wedding-website": { motif: "overlay", bloomX: 28, bloom2X: 78, bloomY: 20, bloom2Y: 84, gridSize: 92 },
  "startup-website": { motif: "focus", bloomX: 62, bloom2X: 88, bloomY: 22, bloom2Y: 78, gridSize: 120 },
  "online-store": { motif: "panels", bloomX: 24, bloom2X: 86, bloomY: 20, bloom2Y: 84, gridSize: 72 },
  "company-website": { motif: "architecture", bloomX: 48, bloom2X: 76, bloomY: 30, bloom2Y: 66, gridSize: 96 },
  "academy-website": { motif: "layers", bloomX: 20, bloom2X: 68, bloomY: 36, bloom2Y: 82, gridSize: 84 },
  "restaurant-website": { motif: "scatter", bloomX: 66, bloom2X: 26, bloomY: 24, bloom2Y: 86, gridSize: 68 },
  "tourism-website": { motif: "orbit", bloomX: 40, bloom2X: 90, bloomY: 44, bloom2Y: 22, gridSize: 112 },
  "small-business-website": { motif: "document", bloomX: 26, bloom2X: 74, bloomY: 28, bloom2Y: 80, gridSize: 96 },

  // Applications
  "web-app": { motif: "lattice", bloomX: 40, bloom2X: 84, bloomY: 18, bloom2Y: 88, gridSize: 64 },

  // UI/UX design
  "ui-ux-design": { motif: "frames", bloomX: 22, bloom2X: 78, bloomY: 24, bloom2Y: 76, gridSize: 80 },

  // Digital marketing
  "digital-marketing": { motif: "signal", bloomX: 30, bloom2X: 84, bloomY: 16, bloom2Y: 88, gridSize: 60 },
};

/** Used when a service arrives without a composition entry (new data, typo). */
export const CATEGORY_HERO_COMPOSITIONS = {
  "web-development": SERVICE_HERO_COMPOSITIONS["startup-website"],
  "small-business-websites": SERVICE_HERO_COMPOSITIONS["small-business-website"],
  applications: SERVICE_HERO_COMPOSITIONS["web-app"],
  "ui-ux-design": SERVICE_HERO_COMPOSITIONS["ui-ux-design"],
  "digital-marketing": SERVICE_HERO_COMPOSITIONS["digital-marketing"],
};

const DEFAULT_HERO_COMPOSITION = {
  motif: "architecture",
  bloomX: 28,
  bloom2X: 82,
  bloomY: 18,
  bloom2Y: 86,
  gridSize: 88,
};

const percent = (value) => `${value}%`;

/**
 * Resolves the backdrop a service should render.
 *
 * @param {{ slug?: string, category?: string }} service
 * @returns {{ motifId: string, Motif: Function, style: Record<string, string> }}
 */
export function getHeroComposition(service) {
  const preset =
    SERVICE_HERO_COMPOSITIONS[service?.slug] ??
    CATEGORY_HERO_COMPOSITIONS[service?.category] ??
    DEFAULT_HERO_COMPOSITION;

  return {
    motifId: preset.motif,
    Motif: HERO_MOTIFS[preset.motif] ?? HERO_MOTIFS.architecture,
    style: {
      "--hero-bloom-x": percent(preset.bloomX),
      "--hero-bloom-2-x": percent(preset.bloom2X),
      "--hero-bloom-y": percent(preset.bloomY),
      "--hero-bloom-2-y": percent(preset.bloom2Y),
      "--hero-grid-size": `${preset.gridSize}px`,
    },
  };
}
