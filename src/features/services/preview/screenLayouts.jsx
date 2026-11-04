/**
 * Laptop preview screens.
 *
 * Every layout is drawn at one fixed design size (1280 x 800) and scaled down
 * by the device frame, so proportions are identical at any width and nothing
 * reflows on resize.
 *
 * They are pure geometry on purpose: no marketing copy, no invented client
 * work, no fabricated screenshots. What changes between services is the
 * *structure* — a store shows product tiles, a booking-style dashboard shows
 * metrics, a design-system screen shows a type scale — plus one accent element
 * chosen by `accentIndex`, so two services never show the same frame.
 *
 * All colours come from the `--pv-*` tokens declared on `.service-preview`
 * (see src/styles/index.css). Those tokens are fixed-neutral: the mockup is a
 * picture of a website, not a surface of this one.
 */

const px = (value) => (typeof value === "number" ? `${value}px` : value);

const TONE = {
  line: "bg-[var(--pv-line)]",
  lineStrong: "bg-[var(--pv-line-strong)]",
  ink: "bg-[var(--pv-ink)]",
  inkSoft: "bg-[var(--pv-ink-soft)]",
  muted: "bg-[var(--pv-muted)]",
  surface: "bg-[var(--pv-surface)]",
  surface2: "bg-[var(--pv-surface-2)]",
  accent: "bg-[var(--pv-accent)]",
  accentSoft: "bg-[var(--pv-accent-soft)]",
  canvas: "bg-[var(--pv-canvas)]",
};

/** A rounded block standing in for a line of text or a solid shape. */
function Bar({ w = "100%", h = 8, tone = "line", r, className = "" }) {
  return (
    <span
      className={`block shrink-0 ${TONE[tone]} ${className}`}
      style={{ width: px(w), height: px(h), borderRadius: r ?? Math.min(h, 99) / 2 }}
    />
  );
}

function Chrome({ children, className = "" }) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden bg-[var(--pv-canvas)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Site header, shared by every website-style layout so they read as one family. */
function TopBar({ accentIndex = 0, compact = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-between border-b border-[var(--pv-line)] ${
        compact ? "px-9 py-4" : "px-12 py-6"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-[7px] bg-[var(--pv-ink)]">
          <span className="text-[13px] font-black leading-none text-[var(--pv-canvas)]">H</span>
        </span>
        <Bar w={58} h={9} tone="lineStrong" />
      </div>
      <div className="flex items-center gap-7">
        {[46, 38, 52, 34].map((w, i) => (
          <Bar key={i} w={w} h={7} tone={i === accentIndex % 4 ? "accent" : "line"} />
        ))}
        <span className="h-9 w-32 rounded-full bg-[var(--pv-ink)]" />
      </div>
    </div>
  );
}

/** Small labelled axis used by the chart layouts. */
function Axis({ rows = 4 }) {
  return (
    <div className="flex h-full flex-col justify-between">
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="border-t border-dashed border-[var(--pv-line)]" />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- business */

export function BusinessScreen({ accentIndex = 0, variant }) {
  const isCorporate = variant === "corporate";

  return (
    <Chrome>
      <TopBar accentIndex={accentIndex} />

      <div className="flex flex-1 items-stretch gap-10 px-12 py-10">
        <div className="flex w-[46%] flex-col justify-center gap-4">
          <Bar w={116} h={9} tone="accent" />
          <div className="mt-2 flex flex-col gap-3">
            <Bar w="100%" h={30} tone="inkSoft" />
            <Bar w="88%" h={30} tone="inkSoft" />
            <Bar w="58%" h={30} tone="inkSoft" />
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <Bar w="94%" h={8} />
            <Bar w="80%" h={8} />
            <Bar w="64%" h={8} />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-11 w-40 rounded-full bg-[var(--pv-ink)]" />
            <span className="h-11 w-28 rounded-full border border-[var(--pv-line-strong)]" />
          </div>
        </div>

        {isCorporate ? (
          // Corporate reads as a record of the company rather than a single
          // campaign: three credentials, one of them carrying the accent.
          <div className="flex flex-1 flex-col gap-5 rounded-[16px] bg-[var(--pv-surface)] p-7">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex flex-1 items-center gap-4 rounded-[12px] border p-5 ${
                  i === accentIndex % 3
                    ? "border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]"
                    : "border-[var(--pv-line)]"
                }`}
              >
                <Bar w={54} h={26} tone={i === accentIndex % 3 ? "accent" : "inkSoft"} />
                <div className="flex flex-1 flex-col gap-2.5">
                  <Bar w="62%" h={8} tone="lineStrong" />
                  <Bar w="94%" h={7} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative flex-1 overflow-hidden rounded-[16px] bg-[var(--pv-surface)]">
            <div className="absolute inset-5 rounded-[11px] border border-[var(--pv-line)]" />
            <div className="absolute inset-x-9 top-9 h-[48%] rounded-[10px] bg-[var(--pv-surface-2)]" />
            <div className="absolute inset-x-9 bottom-9 flex flex-col gap-3">
              <Bar w="70%" h={9} tone="lineStrong" />
              <Bar w="100%" h={7} />
              <Bar w="88%" h={7} />
            </div>
            <span className="absolute end-7 top-7 size-14 rounded-full bg-[var(--pv-accent-soft)]" />
          </div>
        )}
      </div>

      {isCorporate ? (
        // A quiet partner strip, which is what a visitor looks for next.
        <div className="flex shrink-0 items-center justify-between gap-7 border-t border-[var(--pv-line)] px-12 py-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <Bar
              key={i}
              w={92}
              h={12}
              tone={i === accentIndex % 5 ? "accent" : "lineStrong"}
            />
          ))}
        </div>
      ) : (
        <div className="grid shrink-0 grid-cols-3 gap-7 border-t border-[var(--pv-line)] px-12 py-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className={`mt-0.5 size-9 shrink-0 rounded-[9px] ${
                  i === accentIndex % 3 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                }`}
              />
              <div className="flex flex-1 flex-col gap-2.5">
                <Bar w="52%" h={9} tone="lineStrong" />
                <Bar w="100%" h={7} />
                <Bar w="72%" h={7} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Chrome>
  );
}

/* --------------------------------------------------------------- portfolio */

export function PortfolioScreen({ accentIndex = 0, variant }) {
  const isEditorial = variant === "editorial";

  return (
    <Chrome>
      <div className="flex shrink-0 items-start justify-between px-12 pb-8 pt-12">
        <div className="flex flex-col gap-3">
          <Bar w={330} h={34} tone="inkSoft" />
          <Bar w={196} h={34} tone="inkSoft" />
          <Bar w={104} h={8} tone="accent" className="mt-2" />
        </div>
        <div className="flex flex-col items-end gap-2 pt-1">
          <Bar w={84} h={7} />
          <Bar w={64} h={7} />
          <Bar w={74} h={7} />
        </div>
      </div>

      {isEditorial ? (
        <div className="flex flex-1 flex-col justify-center gap-7 px-12 pb-12">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-[var(--pv-line)] pb-6 last:border-0 last:pb-0"
            >
              <Bar w={22} h={8} tone={i === accentIndex % 4 ? "accent" : "muted"} />
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <Bar w={`${74 - i * 9}%`} h={15} tone="inkSoft" />
                <Bar w={`${52 - i * 5}%`} h={7} />
              </div>
              <span className="h-16 w-24 shrink-0 rounded-[8px] bg-[var(--pv-surface)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-2 gap-5 px-12 pb-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div
                className={`relative flex-1 overflow-hidden rounded-[14px] ${
                  i === accentIndex % 4 ? "bg-[var(--pv-accent-soft)]" : "bg-[var(--pv-surface)]"
                }`}
              >
                <span className="absolute inset-6 rounded-[9px] border border-[var(--pv-line)]" />
                <span className="absolute bottom-6 start-6 h-8 w-24 rounded-full bg-[var(--pv-canvas)]" />
              </div>
              <div className="flex items-center justify-between">
                <Bar w={112} h={8} tone="lineStrong" />
                <Bar w={38} h={8} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex shrink-0 items-center justify-between border-t border-[var(--pv-line)] px-12 py-6">
        <Bar w={140} h={8} tone="lineStrong" />
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-7 rounded-full bg-[var(--pv-surface-2)]" />
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------- store */

export function StoreScreen({ accentIndex = 0, variant }) {
  const isMenu = variant === "menu";

  return (
    <Chrome>
      <TopBar accentIndex={accentIndex} compact />

      <div className="flex shrink-0 items-center gap-4 border-b border-[var(--pv-line)] px-9 py-5">
        {[70, 92, 64, 104].map((w, i) => (
          <span
            key={i}
            className={`rounded-full px-4 py-2 ${
              i === 0 ? "bg-[var(--pv-ink)]" : "bg-[var(--pv-surface)]"
            }`}
          >
            <Bar w={w} h={7} tone={i === 0 ? "canvas" : "lineStrong"} />
          </span>
        ))}
        <span className="ms-auto h-9 w-28 rounded-full border border-[var(--pv-line-strong)]" />
      </div>

      <div className="flex flex-1 gap-7 px-9 py-7">
        {isMenu ? (
          // A restaurant menu reads as courses, not as a product grid: each
          // group is a heading with priced lines under it.
          <div className="grid flex-1 grid-cols-2 gap-x-12 gap-y-7">
            {[0, 1, 2, 3].map((group) => (
              <div key={group} className="flex flex-col gap-4">
                <Bar w={74} h={9} tone={group === accentIndex % 4 ? "accent" : "lineStrong"} />
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-baseline gap-3">
                    <Bar w={`${62 - row * 8}%`} h={8} tone="inkSoft" />
                    <span className="h-px flex-1 bg-[var(--pv-line)]" />
                    <Bar w={26} h={8} tone="lineStrong" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="relative flex-1 overflow-hidden rounded-[12px] bg-[var(--pv-surface)]">
                  <span className="absolute inset-5 rounded-[8px] bg-[var(--pv-surface-2)]" />
                  <span
                    className={`absolute end-3 top-3 size-6 rounded-full ${
                      i === accentIndex % 6 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-canvas)]"
                    }`}
                  />
                </div>
                <Bar w="82%" h={8} tone="lineStrong" />
                <div className="flex items-center justify-between">
                  <Bar w={44} h={9} tone="ink" />
                  <Bar w={22} h={7} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex w-[26%] flex-col gap-4 rounded-[14px] bg-[var(--pv-surface)] p-5">
          <Bar w={72} h={9} tone="lineStrong" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="size-9 shrink-0 rounded-[8px] bg-[var(--pv-surface-2)]" />
              <div className="flex flex-1 flex-col gap-2">
                <Bar w="100%" h={7} />
                <Bar w="54%" h={7} />
              </div>
            </div>
          ))}
          <div className="mt-auto flex flex-col gap-3">
            <span className="h-px w-full bg-[var(--pv-line)]" />
            <div className="flex items-center justify-between">
              <Bar w={38} h={8} />
              <Bar w={56} h={12} tone="ink" />
            </div>
            <span className="h-11 w-full rounded-full bg-[var(--pv-accent)]" />
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ----------------------------------------------------------------- landing */

export function LandingScreen({ accentIndex = 0 }) {
  return (
    <Chrome>
      <div className="flex shrink-0 items-center justify-between px-12 py-7">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-[6px] bg-[var(--pv-ink)]">
            <span className="text-[11px] font-black leading-none text-[var(--pv-canvas)]">H</span>
          </span>
          <Bar w={48} h={8} tone="lineStrong" />
        </div>
        <span className="h-9 w-32 rounded-full bg-[var(--pv-ink)]" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-20 text-center">
        <span className="flex items-center gap-2 rounded-full bg-[var(--pv-surface)] px-4 py-2">
          <span className="size-2 rounded-full bg-[var(--pv-accent)]" />
          <Bar w={86} h={7} tone="lineStrong" />
        </span>
        <div className="mt-2 flex w-full flex-col items-center gap-3.5">
          <Bar w="78%" h={38} tone="inkSoft" />
          <Bar w="62%" h={38} tone="inkSoft" />
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-3">
          <Bar w="54%" h={8} />
          <Bar w="42%" h={8} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-12 w-44 rounded-full bg-[var(--pv-ink)]" />
          <span className="h-12 w-36 rounded-full border border-[var(--pv-line-strong)]" />
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-3 border-t border-[var(--pv-line)] px-12 py-7">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-2.5 ${
              i === accentIndex % 3 ? "text-[var(--pv-accent-ink)]" : ""
            }`}
          >
            <Bar w={68} h={18} tone={i === accentIndex % 3 ? "accent" : "inkSoft"} />
            <Bar w={102} h={7} />
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* --------------------------------------------------------------- dashboard */

export function DashboardScreen({ accentIndex = 0, variant }) {
  const isHealth = variant === "health";
  // Maintenance reads as a run of near-unbroken days; the one shorter bar is
  // the incident the accent points at.
  const series = isHealth
    ? [96, 98, 97, 99, 96, 93, 58, 94, 98, 99, 97, 99]
    : [38, 52, 44, 66, 58, 78, 71, 92];
  const peakIndex = isHealth ? 6 : series.length - 1;

  return (
    <Chrome>
      <div className="flex flex-1">
        <div className="flex w-[20%] flex-col gap-2 border-e border-[var(--pv-line)] p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="size-7 rounded-[7px] bg-[var(--pv-ink)]" />
            <Bar w={52} h={8} tone="lineStrong" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 ${
                i === accentIndex % 5 ? "bg-[var(--pv-accent-soft)]" : ""
              }`}
            >
              <span
                className={`size-4 rounded-[4px] ${
                  i === accentIndex % 5 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                }`}
              />
              <Bar w={62 + ((i * 13) % 22)} h={7} tone={i === accentIndex % 5 ? "lineStrong" : "line"} />
            </div>
          ))}
          <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--pv-line)] pt-4">
            <span className="size-7 rounded-full bg-[var(--pv-surface-2)]" />
            <Bar w={54} h={7} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-7">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Bar w={128} h={10} tone="lineStrong" />
              <Bar w={86} h={7} />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="size-9 rounded-full border border-[var(--pv-line-strong)]" />
              <span className="h-9 w-28 rounded-full bg-[var(--pv-ink)]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex flex-col gap-3 rounded-[12px] border p-4 ${
                  i === accentIndex % 3
                    ? "border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]"
                    : "border-[var(--pv-line)]"
                }`}
              >
                <Bar w="46%" h={7} />
                <Bar w="64%" h={16} tone="inkSoft" />
                <Bar w="30%" h={7} tone={i === accentIndex % 3 ? "accent" : "line"} />
              </div>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 gap-4">
            <div className="relative flex flex-1 flex-col rounded-[12px] border border-[var(--pv-line)] p-4">
              <div className="flex items-center justify-between">
                <Bar w={92} h={8} tone="lineStrong" />
                <Bar w={40} h={7} />
              </div>
              <div className="relative mt-4 flex-1">
                <div className="absolute inset-0">
                  <Axis rows={4} />
                </div>
                <div className={`absolute inset-0 flex items-end ${isHealth ? "gap-1.5" : "gap-2.5"}`}>
                  {series.map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-t-[5px] ${
                        i === peakIndex ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-[34%] flex-col gap-3 rounded-[12px] border border-[var(--pv-line)] p-4">
              <Bar w={isHealth ? 86 : 64} h={8} tone="lineStrong" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span
                    className={`size-6 shrink-0 rounded-full ${
                      isHealth && i < 2
                        ? "border-2 border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]"
                        : "bg-[var(--pv-surface-2)]"
                    }`}
                  />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Bar w="86%" h={6} />
                    <Bar w="52%" h={6} />
                  </div>
                </div>
              ))}
              <div className="mt-auto flex flex-col gap-2">
                <Bar w="100%" h={6} tone="accentSoft" />
                <Bar w="64%" h={6} tone="accentSoft" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* --------------------------------------------------------------- analytics */

export function AnalyticsScreen({ accentIndex = 0, variant }) {
  const isFunnel = variant === "funnel";
  const isSearch = variant === "search";
  const isCampaign = variant === "campaign";
  const isResearch = variant === "research";

  return (
    <Chrome>
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--pv-line)] px-9 py-5">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-[7px] bg-[var(--pv-ink)]" />
          <Bar w={70} h={9} tone="lineStrong" />
        </div>
        <div className="flex items-center gap-2">
          {[74, 62, 88].map((w, i) => (
            <span
              key={i}
              className={`rounded-full px-4 py-2 ${
                i === accentIndex % 3 ? "bg-[var(--pv-ink)]" : "bg-[var(--pv-surface)]"
              }`}
            >
              <Bar w={w} h={7} tone={i === accentIndex % 3 ? "canvas" : "lineStrong"} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 gap-5 px-9 py-6">
        <div className="flex w-[34%] flex-col gap-4">
          <div className="relative flex flex-1 items-center justify-center rounded-[12px] border border-[var(--pv-line)]">
            <span className="absolute size-[132px] rounded-full border-[14px] border-[var(--pv-surface-2)]" />
            <span className="absolute size-[132px] rotate-45 rounded-full border-[14px] border-transparent border-t-[var(--pv-accent)] border-r-[var(--pv-accent)]" />
            <span className="relative size-11 rounded-full bg-[var(--pv-canvas)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-2 rounded-[10px] border border-[var(--pv-line)] p-3">
                <Bar w="54%" h={6} />
                <Bar w="70%" h={12} tone="inkSoft" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="relative flex-1 rounded-[12px] border border-[var(--pv-line)] p-4">
            <div className="flex items-center justify-between">
              <Bar w={104} h={8} tone="lineStrong" />
              <div className="flex gap-2">
                <span className="size-2.5 rounded-full bg-[var(--pv-accent)]" />
                <span className="size-2.5 rounded-full bg-[var(--pv-surface-2)]" />
              </div>
            </div>
            {isCampaign ? (
              <div className="mt-5 flex h-[calc(100%-2.5rem)] flex-col justify-center gap-4">
                {[88, 74, 61, 46, 32].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Bar w={84} h={7} />
                    <div className="flex-1">
                      <span
                        className={`block h-4 rounded-full ${
                          i === accentIndex % 5
                            ? "bg-[var(--pv-accent)]"
                            : "bg-[var(--pv-surface-2)]"
                        }`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <Bar w={28} h={7} tone="lineStrong" />
                  </div>
                ))}
              </div>
            ) : isResearch ? (
              <div className="mt-4 grid h-[calc(100%-2rem)] grid-cols-10 grid-rows-5 gap-1.5">
                {Array.from({ length: 50 }, (_, i) => (
                  <span
                    key={i}
                    className="rounded-[3px] bg-[var(--pv-accent)]"
                    style={{ opacity: [0.06, 0.12, 0.22, 0.4, 0.78][(i * 7) % 5] }}
                  />
                ))}
              </div>
            ) : (
              <div className="relative mt-4 h-[calc(100%-2rem)]">
                <div className="absolute inset-0">
                  <Axis rows={4} />
                </div>
                <div className="absolute inset-0 flex items-end gap-2">
                  {(isFunnel ? [100, 78, 54, 32, 18] : [34, 48, 41, 62, 55, 74, 68, 86, 79, 94]).map(
                    (h, i) => (
                      <span
                        key={i}
                        className={`flex-1 rounded-t-[5px] ${
                          i === (isFunnel ? 0 : 9)
                            ? "bg-[var(--pv-accent)]"
                            : "bg-[var(--pv-surface-2)]"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex h-[38%] flex-col gap-3 rounded-[12px] border border-[var(--pv-line)] p-4">
            <div className="flex items-center justify-between">
              <Bar w={72} h={8} tone="lineStrong" />
              <Bar w={30} h={7} />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Bar w={16} h={7} tone={isSearch ? "ink" : "line"} />
                <div className="flex-1">
                  <Bar
                    w={`${92 - i * (isSearch ? 18 : 12)}%`}
                    h={7}
                    tone={i === accentIndex % 3 ? "accent" : "lineStrong"}
                  />
                </div>
                <Bar w={28} h={7} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------ designSystem */

export function DesignSystemScreen({ accentIndex = 0, variant }) {
  const isAudit = variant === "audit";

  return (
    <Chrome>
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--pv-line)] px-10 py-5">
        <div className="flex items-center gap-3">
          <span className="size-7 rounded-[7px] bg-[var(--pv-ink)]" />
          <Bar w={96} h={9} tone="lineStrong" />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-7 rounded-full bg-[var(--pv-surface-2)]" />
          ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-8 px-10 py-8">
        <div className="flex flex-col gap-5">
          <Bar w={88} h={7} tone="accent" />
          <div className="flex flex-col gap-3">
            <Bar w="86%" h={34} tone="inkSoft" />
            <Bar w="70%" h={24} tone="inkSoft" />
            <Bar w="58%" h={18} tone="inkSoft" />
            <Bar w="46%" h={12} tone="lineStrong" />
            <Bar w="38%" h={9} />
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <Bar w={64} h={7} />
            <div className="flex gap-2.5">
              {["accent", "accentSoft", "inkSoft", "surface2", "line"].map((tone, i) => (
                <span
                  key={tone}
                  className={`${TONE[tone]} size-11 rounded-[10px]`}
                  style={{ outline: i === accentIndex % 5 ? "2px solid var(--pv-accent)" : "none", outlineOffset: 3 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--pv-line)] p-5">
            <Bar w={72} h={7} tone="lineStrong" />
            <div className="flex items-center gap-2.5">
              <span className="h-10 w-28 rounded-full bg-[var(--pv-ink)]" />
              <span className="h-10 w-24 rounded-full border border-[var(--pv-line-strong)]" />
              <span className="h-10 w-10 rounded-full bg-[var(--pv-accent)]" />
            </div>
            <div className="mt-1 flex flex-col gap-2">
              <span className="h-10 rounded-[8px] border border-[var(--pv-line-strong)]" />
              <span className="h-10 rounded-[8px] border border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]" />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3 rounded-[12px] border border-[var(--pv-line)] p-5">
            <Bar w={isAudit ? 96 : 76} h={7} tone="lineStrong" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--pv-line-strong)]" />
                <div className="flex flex-1 items-center gap-1">
                  {Array.from({ length: 8 }, (_, j) => (
                    <span
                      key={j}
                      className={`h-4 flex-1 rounded-[2px] ${
                        isAudit && j > 4 ? "bg-[var(--pv-accent-soft)]" : "bg-[var(--pv-surface-2)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------------------------------------------ mobile */

export function MobileScreen({ accentIndex = 0, variant }) {
  const twoUp = variant === "prototype";

  return (
    <Chrome className="flex-row items-center justify-center gap-10 bg-[var(--pv-surface)] px-12">
      {[0, 1].slice(0, twoUp ? 2 : 1).map((phone) => (
        <div
          key={phone}
          className="relative flex h-[86%] w-[30%] flex-col overflow-hidden rounded-[26px] border border-[var(--pv-line-strong)] bg-[var(--pv-canvas)] p-3"
          style={{ transform: phone === 0 ? "rotate(-3deg)" : "rotate(3deg)" }}
        >
          <span className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[var(--pv-surface-2)]" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Bar w={64} h={8} tone="lineStrong" />
              <Bar w={42} h={6} />
            </div>
            <span className="size-8 rounded-full bg-[var(--pv-surface-2)]" />
          </div>

          <div
            className={`mt-4 flex flex-col gap-2.5 rounded-[14px] p-3.5 ${
              phone === 0 ? "bg-[var(--pv-accent-soft)]" : "bg-[var(--pv-surface)]"
            }`}
          >
            <Bar w="46%" h={6} />
            <Bar w="62%" h={16} tone="inkSoft" />
            <div className="mt-2 flex items-end gap-1.5">
              {[34, 52, 44, 70, 58, 86].map((h, i) => (
                <span
                  key={i}
                  className={`w-full rounded-t-[3px] ${
                    i === 5 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                  }`}
                  style={{ height: px(h) }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-1 flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-[10px] border border-[var(--pv-line)] p-2.5"
              >
                <span
                  className={`size-7 shrink-0 rounded-[7px] ${
                    i === accentIndex % 3 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                  }`}
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Bar w="72%" h={6} tone="lineStrong" />
                  <Bar w="46%" h={5} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-around border-t border-[var(--pv-line)] pt-3">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`size-4 rounded-[4px] ${
                  i === accentIndex % 4 ? "bg-[var(--pv-accent)]" : "bg-[var(--pv-surface-2)]"
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </Chrome>
  );
}

/* ------------------------------------------------------------------ social */

export function SocialScreen({ accentIndex = 0 }) {
  return (
    <Chrome>
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--pv-line)] px-9 py-5">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-full bg-[var(--pv-ink)]" />
          <Bar w={62} h={8} tone="lineStrong" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-8 w-24 rounded-full bg-[var(--pv-surface)]" />
          <span className="h-8 w-20 rounded-full bg-[var(--pv-accent)]" />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-4 px-9 py-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={`flex flex-col gap-2.5 rounded-[12px] border p-3 ${
              i === accentIndex % 3
                ? "border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]"
                : "border-[var(--pv-line)]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-[var(--pv-surface-2)]" />
              <Bar w="52%" h={6} tone="lineStrong" />
            </div>
            <div className="flex-1 rounded-[8px] bg-[var(--pv-surface)]" />
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="size-4 rounded-[4px] bg-[var(--pv-surface-2)]" />
                <span className="size-4 rounded-[4px] bg-[var(--pv-surface-2)]" />
              </div>
              <Bar w={30} h={6} />
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* --------------------------------------------------------------- wireframe */

export function WireframeScreen({ accentIndex = 0 }) {
  return (
    <Chrome className="bg-[var(--pv-surface)]">
      <div className="flex flex-1 flex-col gap-5 p-10">
        <div className="flex items-center justify-between">
          <span className="h-8 w-28 rounded-[4px] border border-dashed border-[var(--pv-line-strong)]" />
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-6 w-20 rounded-[4px] border border-dashed border-[var(--pv-line-strong)]"
              />
            ))}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[1.4fr_1fr] gap-5">
          <div className="relative flex flex-col justify-center gap-3 rounded-[6px] border border-dashed border-[var(--pv-line-strong)] p-6">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-7 border border-dashed ${
                  i === accentIndex % 4
                    ? "w-[72%] border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]"
                    : "w-full border-[var(--pv-line-strong)]"
                }`}
              />
            ))}
            <span className="mt-2 h-9 w-32 rounded-[4px] border border-[var(--pv-accent)] bg-[var(--pv-accent-soft)]" />
            <span className="absolute -end-3 top-6 flex size-6 items-center justify-center rounded-full bg-[var(--pv-accent)] text-[10px] font-bold text-[var(--pv-canvas)]">
              1
            </span>
          </div>

          <div className="relative rounded-[6px] border border-dashed border-[var(--pv-line-strong)] bg-[var(--pv-surface-2)]">
            <span className="absolute inset-6 rounded-[4px] border border-dashed border-[var(--pv-line-strong)]" />
            <span className="absolute -start-3 top-[38%] size-6 rotate-45 bg-[var(--pv-accent-soft)]" />
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2.5 rounded-[6px] border border-dashed border-[var(--pv-line-strong)] p-4"
            >
              <span className="size-7 rounded-[4px] bg-[var(--pv-surface-2)]" />
              <span className="h-3 w-3/4 bg-[var(--pv-line-strong)]" />
              <span className="h-3 w-full bg-[var(--pv-line)]" />
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}
