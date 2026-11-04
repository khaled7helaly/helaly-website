/**
 * Service hero motifs.
 *
 * Abstract geometry only: no screenshots, no mock browser chrome, nothing that
 * could be mistaken for a real product image. Every shape is painted through
 * the `hm-*` classes in src/styles/index.css, which resolve to the tone tokens
 * of whichever backdrop layer is rendering — so one definition renders
 * correctly in the luminous tone (site is dark) and the deep tone (site is
 * light).
 *
 * All motifs share a 1200x700 viewBox. Geometry is kept towards the end edge,
 * where the hero artwork sits, so it reads as depth behind the composition
 * rather than as a competing illustration.
 */

/* Business websites: layered architectural planes and a light column. */
export function ArchitectureMotif() {
  return (
    <>
      <rect
        x="150"
        y="110"
        width="600"
        height="430"
        rx="26"
        fill="none"
        className="hm-line"
        strokeWidth="1.5"
      />
      <rect
        x="215"
        y="165"
        width="600"
        height="430"
        rx="26"
        className="hm-fill hm-line-strong"
        strokeWidth="1.5"
      />
      <rect
        x="280"
        y="220"
        width="600"
        height="430"
        rx="26"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <path
        d="M340 620V480a70 70 0 0 1 140 0v140"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
      />
      <path d="M540 620V440h150v180" fill="none" className="hm-line-strong" strokeWidth="1.5" />
      <rect x="960" y="140" width="88" height="420" rx="44" className="hm-accent" />
      <rect x="1074" y="250" width="44" height="310" rx="22" className="hm-fill-strong" />
      <path
        d="M110 470h70M110 510h70M110 550h70"
        strokeLinecap="round"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2"
      />
      <circle cx="1105" cy="620" r="7" className="hm-accent-soft" />
    </>
  );
}

/* Landing pages: focused radial lighting inside a dynamic diamond. */
export function FocusMotif() {
  return (
    <>
      <path d="M780 90 1200 350 780 610 360 350z" fill="none" className="hm-line" strokeWidth="1.5" />
      {[280, 214, 148, 84].map((radius) => (
        <circle
          key={radius}
          cx="780"
          cy="350"
          r={radius}
          fill="none"
          className={radius === 84 ? "hm-accent-line" : "hm-line"}
          strokeWidth="1.5"
        />
      ))}
      <circle cx="780" cy="350" r="34" className="hm-accent" />
      <path
        d="M780 66V20M780 634v46M496 350h-46M1064 350h46"
        strokeLinecap="round"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2"
      />
      <rect x="120" y="560" width="180" height="12" rx="6" className="hm-fill-strong" />
      <rect x="120" y="596" width="110" height="12" rx="6" className="hm-fill" />
    </>
  );
}

/* E-commerce: structured floating panels with product-card detail. */
export function PanelsMotif() {
  return (
    <>
      <rect
        x="200"
        y="140"
        width="290"
        height="420"
        rx="24"
        transform="rotate(-4 345 350)"
        className="hm-fill hm-line"
        strokeWidth="1.5"
      />
      <rect
        x="560"
        y="90"
        width="300"
        height="520"
        rx="24"
        className="hm-fill hm-line-strong"
        strokeWidth="1.5"
      />
      <rect
        x="940"
        y="160"
        width="270"
        height="380"
        rx="24"
        transform="rotate(5 1075 350)"
        className="hm-fill hm-line"
        strokeWidth="1.5"
      />
      <rect x="600" y="130" width="220" height="150" rx="14" className="hm-accent" />
      <g className="hm-accent-soft">
        <rect x="600" y="320" width="220" height="14" rx="7" />
        <rect x="600" y="352" width="150" height="14" rx="7" />
      </g>
      <path d="M600 430h220M600 470h110" fill="none" className="hm-line-strong" strokeWidth="1.5" />
      <circle cx="820" cy="560" r="10" className="hm-accent-soft" />
    </>
  );
}

/* Portfolio: editorial column with a luminous type block. */
export function EditorialMotif() {
  return (
    <>
      <circle cx="880" cy="300" r="210" className="hm-accent-soft" />
      <circle cx="880" cy="300" r="210" fill="none" className="hm-line" strokeWidth="1.5" />
      <rect x="180" y="150" width="14" height="400" rx="7" className="hm-accent" />
      <g className="hm-fill-strong">
        <rect x="240" y="180" width="360" height="30" rx="15" />
        <rect x="240" y="240" width="280" height="30" rx="15" />
        <rect x="240" y="300" width="320" height="30" rx="15" />
      </g>
      <g className="hm-fill">
        <rect x="240" y="380" width="420" height="14" rx="7" />
        <rect x="240" y="414" width="380" height="14" rx="7" />
        <rect x="240" y="448" width="300" height="14" rx="7" />
      </g>
      <path d="M240 520h480" fill="none" className="hm-line-strong" strokeWidth="1.5" />
    </>
  );
}

const LATTICE_COLUMNS = [0, 1, 2, 3, 4, 5];
const LATTICE_ROWS = [0, 1, 2, 3];

/* Custom web application: layered technical grid with a rising data cluster. */
export function LatticeMotif() {
  return (
    <>
      <g className="hm-accent-soft">
        {LATTICE_ROWS.map((row) =>
          LATTICE_COLUMNS.map((column) => (
            <circle
              key={`${row}-${column}`}
              cx={340 + column * 116}
              cy={190 + row * 112}
              r="3.5"
            />
          )),
        )}
      </g>
      <g fill="none" className="hm-line">
        {LATTICE_ROWS.map((row) => (
          <path key={`row-${row}`} d={`M340 ${190 + row * 112}H920`} strokeWidth="1" />
        ))}
        {LATTICE_COLUMNS.map((column) => (
          <path key={`column-${column}`} d={`M${340 + column * 116} 190V526`} strokeWidth="1" />
        ))}
      </g>
      <g className="hm-fill-strong">
        <rect x="420" y="370" width="44" height="170" rx="10" />
        <rect x="540" y="310" width="44" height="230" rx="10" />
        <rect x="660" y="250" width="44" height="290" rx="10" />
      </g>
      <rect x="780" y="190" width="44" height="350" rx="10" className="hm-accent" />
      <path d="M260 566h720" fill="none" className="hm-line-strong" strokeWidth="1.5" />
    </>
  );
}

const LAYER_OFFSETS = [0, 1, 2, 3];

/* Website maintenance: stacked revision sheets. */
export function LayersMotif() {
  return (
    <>
      {LAYER_OFFSETS.map((index) => (
        <rect
          key={index}
          x={420 + index * 40}
          y={330 - index * 55}
          width="520"
          height="220"
          rx="22"
          className={index === 3 ? "hm-fill-strong hm-line-strong" : "hm-fill hm-line"}
          strokeWidth="1.5"
        />
      ))}
      <path
        d="M960 300v-44M960 300h44"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="960" cy="300" r="9" className="hm-accent" />
      <g className="hm-accent-soft">
        <rect x="180" y="480" width="200" height="14" rx="7" />
        <rect x="180" y="514" width="140" height="14" rx="7" />
      </g>
    </>
  );
}

/* Website UI design: overlapping layout frames with a measurement node. */
export function FramesMotif() {
  return (
    <>
      <rect
        x="230"
        y="120"
        width="480"
        height="320"
        rx="18"
        transform="rotate(-5 470 280)"
        fill="none"
        className="hm-line"
        strokeWidth="1.5"
      />
      <rect
        x="330"
        y="200"
        width="480"
        height="320"
        rx="18"
        transform="rotate(2 570 360)"
        className="hm-fill hm-line-strong"
        strokeWidth="1.5"
      />
      <rect x="390" y="272" width="240" height="18" rx="9" className="hm-accent" />
      <rect x="390" y="314" width="160" height="12" rx="6" className="hm-accent-soft" />
      <rect x="390" y="342" width="200" height="12" rx="6" className="hm-accent-soft" />
      <circle cx="940" cy="440" r="110" fill="none" className="hm-line" strokeWidth="1.5" />
      <circle cx="940" cy="440" r="12" className="hm-accent" />
      <path
        d="M940 300v-42M940 580v42M800 440h-42M1080 440h42"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

/* Mobile app UI: orbits around a handheld surface. */
export function OrbitMotif() {
  return (
    <>
      <ellipse
        cx="800"
        cy="350"
        rx="360"
        ry="200"
        transform="rotate(-18 800 350)"
        fill="none"
        className="hm-line"
        strokeWidth="1.5"
      />
      <ellipse
        cx="800"
        cy="350"
        rx="260"
        ry="140"
        transform="rotate(24 800 350)"
        fill="none"
        className="hm-line-strong"
        strokeWidth="1.5"
      />
      <rect
        x="760"
        y="230"
        width="120"
        height="240"
        rx="28"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <rect x="790" y="262" width="60" height="8" rx="4" className="hm-accent" />
      <circle cx="480" cy="270" r="16" className="hm-accent" />
      <circle cx="1120" cy="430" r="22" className="hm-accent-soft" />
      <circle cx="700" cy="560" r="10" className="hm-fill-strong" />
    </>
  );
}

const SCATTER_POINTS = [
  [380, 240],
  [520, 190],
  [660, 300],
  [800, 220],
  [940, 340],
  [1040, 250],
  [470, 400],
  [610, 470],
  [760, 420],
  [900, 500],
  [1010, 440],
];

/* UX research: clustered observations joined into a finding. */
export function ScatterMotif() {
  return (
    <>
      <g fill="none" className="hm-line">
        {SCATTER_POINTS.slice(1).map(([x, y], index) => {
          const [previousX, previousY] = SCATTER_POINTS[index];
          return (
            <path
              key={`line-${x}-${y}`}
              d={`M${previousX} ${previousY}L${x} ${y}`}
              strokeWidth="1.25"
            />
          );
        })}
      </g>
      <g className="hm-fill-strong">
        {SCATTER_POINTS.map(([x, y], index) => (
          <circle key={`point-${x}-${y}`} cx={x} cy={y} r={index % 3 === 0 ? 14 : 8} />
        ))}
      </g>
      <circle cx="660" cy="300" r="46" fill="none" className="hm-accent-line" strokeWidth="2" />
      <rect x="200" y="566" width="140" height="12" rx="6" className="hm-accent" />
    </>
  );
}

/* Wireframes: a boxed layout skeleton. */
export function WireframeMotif() {
  return (
    <>
      <rect
        x="240"
        y="110"
        width="760"
        height="480"
        rx="20"
        fill="none"
        className="hm-line-strong"
        strokeWidth="1.5"
      />
      <path d="M240 200h760M560 200v390M240 380h320" fill="none" className="hm-line" strokeWidth="1.5" />
      <g className="hm-fill-strong">
        <rect x="290" y="250" width="220" height="20" rx="10" />
        <rect x="290" y="300" width="160" height="12" rx="6" />
        <rect x="290" y="330" width="180" height="12" rx="6" />
      </g>
      <g className="hm-accent-soft">
        <rect x="620" y="250" width="300" height="14" rx="7" />
        <rect x="620" y="290" width="240" height="14" rx="7" />
        <rect x="620" y="330" width="280" height="14" rx="7" />
      </g>
      <rect x="290" y="430" width="220" height="110" rx="12" className="hm-accent" />
      <path d="M1060 110v480M240 640h760" fill="none" className="hm-accent-line" strokeWidth="1.5" />
    </>
  );
}

/* Interactive prototypes: inputs converging into one interactive node. */
export function FlowMotif() {
  return (
    <>
      <path
        d="M320 180H520V340M320 520H520V360M596 350H790"
        fill="none"
        className="hm-line-strong"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="180"
        y="140"
        width="140"
        height="80"
        rx="16"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <rect x="180" y="480" width="140" height="80" rx="16" className="hm-fill hm-line" strokeWidth="1.5" />
      <circle cx="558" cy="350" r="38" fill="none" className="hm-line-strong" strokeWidth="1.5" />
      <circle cx="558" cy="350" r="10" className="hm-accent" />
      <rect x="790" y="310" width="160" height="80" rx="16" className="hm-accent" />
      <circle cx="1050" cy="350" r="34" fill="none" className="hm-accent-line" strokeWidth="2" />
    </>
  );
}

/* UI/UX improvements: a dashed previous state replaced by a resolved one. */
export function OverlayMotif() {
  return (
    <>
      <rect
        x="250"
        y="150"
        width="420"
        height="300"
        rx="20"
        fill="none"
        className="hm-line"
        strokeWidth="1.5"
        strokeDasharray="8 10"
      />
      <rect
        x="470"
        y="230"
        width="420"
        height="300"
        rx="20"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <path
        d="M620 380l52 54 116-126"
        fill="none"
        className="hm-accent-line"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M990 190v-52M990 190h52"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="180" y="524" width="180" height="12" rx="6" className="hm-fill" />
    </>
  );
}

const SIGNAL_BARS = [70, 120, 170, 230, 290];

/* SEO: an indexed result set with a rising trend line. */
export function SignalMotif() {
  return (
    <>
      <path d="M300 580h720" fill="none" className="hm-line-strong" strokeWidth="1.5" />
      {SIGNAL_BARS.map((height, index) => (
        <rect
          key={height}
          x={340 + index * 96}
          y={580 - height}
          width="56"
          height={height}
          rx="12"
          className={index === SIGNAL_BARS.length - 1 ? "hm-accent" : "hm-fill"}
        />
      ))}
      <path
        d="M340 470 480 400 620 330 760 250 920 168"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
        strokeDasharray="6 9"
        strokeLinecap="round"
      />
      <circle cx="920" cy="168" r="34" fill="none" className="hm-accent-line" strokeWidth="1.5" />
      <circle cx="920" cy="168" r="12" className="hm-accent" />
    </>
  );
}

const BROADCAST_RADII = [120, 220, 320, 420];

/* Social media: a broadcast source with rising audience reach. */
export function BroadcastMotif() {
  return (
    <>
      {BROADCAST_RADII.map((radius) => (
        <circle
          key={radius}
          cx="420"
          cy="350"
          r={radius}
          fill="none"
          className="hm-line"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="420" cy="350" r="46" className="hm-accent" />
      <path
        d="M548 232a180 180 0 0 1 0 236"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M826 196a230 230 0 0 1 0 308"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="900"
        y="212"
        width="220"
        height="276"
        rx="24"
        className="hm-fill hm-line-strong"
        strokeWidth="1.5"
      />
      <g className="hm-accent-soft">
        <rect x="940" y="258" width="140" height="14" rx="7" />
        <rect x="940" y="292" width="100" height="14" rx="7" />
        <rect x="940" y="326" width="120" height="14" rx="7" />
      </g>
      <circle cx="1010" cy="424" r="26" className="hm-accent" />
    </>
  );
}

/* Content strategy: a structured document with column guides. */
export function DocumentMotif() {
  return (
    <>
      <rect
        x="380"
        y="90"
        width="440"
        height="520"
        rx="24"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <g className="hm-accent">
        <rect x="430" y="160" width="300" height="16" rx="8" />
        <rect x="430" y="200" width="240" height="16" rx="8" />
        <rect x="430" y="240" width="280" height="16" rx="8" />
      </g>
      <g className="hm-accent-soft">
        <rect x="430" y="300" width="300" height="10" rx="5" />
        <rect x="430" y="330" width="270" height="10" rx="5" />
        <rect x="430" y="360" width="290" height="10" rx="5" />
        <rect x="430" y="390" width="200" height="10" rx="5" />
      </g>
      <rect x="430" y="452" width="120" height="16" rx="8" className="hm-accent" />
      <path
        d="M150 90v520M1080 90v520"
        fill="none"
        className="hm-line"
        strokeWidth="1.5"
        strokeDasharray="4 10"
      />
      <circle cx="150" cy="350" r="9" className="hm-accent-soft" />
      <circle cx="1080" cy="350" r="9" className="hm-accent-soft" />
    </>
  );
}

/* Digital advertising: a narrowing funnel that ends at one conversion. */
export function FunnelMotif() {
  return (
    <>
      <rect
        x="340"
        y="140"
        width="520"
        height="90"
        rx="18"
        className="hm-fill-strong hm-line-strong"
        strokeWidth="1.5"
      />
      <rect
        x="410"
        y="262"
        width="380"
        height="90"
        rx="18"
        className="hm-fill hm-line-strong"
        strokeWidth="1.5"
      />
      <rect x="480" y="384" width="240" height="90" rx="18" className="hm-accent" />
      <path
        d="M600 500v96"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="600" cy="628" r="16" className="hm-accent-soft" />
    </>
  );
}

/* Conversion optimisation: a measured target beside a rising step chart. */
export function ConversionMotif() {
  return (
    <>
      <circle cx="830" cy="360" r="200" fill="none" className="hm-line" strokeWidth="1.5" />
      <circle cx="830" cy="360" r="132" fill="none" className="hm-line-strong" strokeWidth="1.5" />
      <circle cx="830" cy="360" r="56" className="hm-accent" />
      <path
        d="M830 160V60M830 560v100M630 360H530M1030 360h100"
        fill="none"
        className="hm-accent-line"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M300 580h150V470h150V360h150"
        fill="none"
        className="hm-line-strong"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="750" cy="360" r="10" className="hm-accent-soft" />
    </>
  );
}
