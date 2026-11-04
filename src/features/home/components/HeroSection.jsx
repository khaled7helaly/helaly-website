// import { Fragment } from "react";
// import { Link } from "react-router";
// import {
//   Activity,
//   ArrowUpRight,
//   Bell,
//   LayoutDashboard,
//   Package,
//   Plus,
//   Search,
//   Settings,
//   Users,
//   Zap,
// } from "lucide-react";
// import {
//   motion,
//   useMotionValue,
//   useReducedMotion,
//   useSpring,
//   useTransform,
// } from "motion/react";
// import { useTranslation } from "react-i18next";

// import Button from "../../../components/ui/Button";
// import Container from "../../../components/ui/Container";
// import { PROJECT_PATH } from "../../../components/layout/navigation";

// /*
//   Concept: "your website, grown into a web app".
//   A quiet centred message, then one large stage: a dashboard on a tilted screen with its
//   mobile twin in front, cropped by the fold and dissolving into the page.
//   The stage is the only bold thing; everything around it stays calm.

//   Performance rules this file follows:
//   - No images, no new packages, no new CSS. The stage is plain DOM + inline SVG.
//   - Pointer movement only changes transforms (compositor friendly). No gradient is repainted.
//   - No backdrop-filter, no blend modes, no infinite loops: after the ~3s intro nothing runs.
//   - The mockup scales with CSS only (container query units): no resize JS, no layout shift.
//   - Reuses hero-section-wash and hero-art-halo.
// */

// const EASE = [0.22, 1, 0.36, 1];
// const SPRING = { stiffness: 70, damping: 18, mass: 0.7 };

// // Painted once and never animated: a soft "sky" so the stage has air around it.
// // Neutral light, not coloured light — the mint is reserved for the data below.
// const SKY = [
//   "radial-gradient(64rem 28rem at 50% -10%, color-mix(in oklab, var(--text-primary) 9%, transparent), transparent 72%)",
//   "radial-gradient(30rem 14rem at 4% 36%, color-mix(in oklab, var(--text-primary) 5%, transparent), transparent 70%)",
//   "radial-gradient(34rem 16rem at 98% 30%, color-mix(in oklab, var(--text-primary) 5%, transparent), transparent 70%)",
// ].join(", ");

// const BRAND_GRADIENT = "linear-gradient(135deg, var(--blue-bright), var(--blue-electric))";
// const BAR_GRADIENT = "linear-gradient(to top, var(--blue-electric), var(--blue-bright))";
// const USER_AVATAR_GRADIENT = "linear-gradient(135deg, var(--blue-bright), var(--blue-electric))";
// // Bars are neutral; exactly one of them is mint, and that is the point of the chart.
// const SOFT_NEUTRAL = "color-mix(in oklab, var(--text-secondary) 26%, transparent)";
// const NAV_ACTIVE = "color-mix(in oklab, var(--blue-bright) 14%, transparent)";
// const FADE_MASK = "linear-gradient(to top, #000 24%, transparent)";

// /* ---------- Mockup content (a web app dashboard) ---------- */

// // Monthly active users: a steady climb, the last bar is the one we point at.
// const BARS = [20, 27, 25, 34, 33, 42, 41, 51, 50, 61, 70, 86];

// const NAV = [
//   ["dashboard", LayoutDashboard],
//   ["users", Users],
//   ["orders", Package],
//   ["analytics", Activity],
//   ["settings", Settings],
// ];

// // The "keeps evolving" story: shipped, being tested, planned.
// const ROADMAP = [
//   { id: "payments", status: "live", progress: 100 },
//   { id: "chat", status: "testing", progress: 68 },
//   { id: "mobile", status: "planned", progress: 24 },
// ];

// const STATUS_DOT = {
//   live: "bg-neon shadow-sm shadow-neon/50",
//   testing: "bg-warning",
//   planned: "bg-brand-light",
// };

// // English fallbacks. The same keys are listed (en + ar) at the bottom of this file.
// const DEFAULTS = {
//   name: "Your App",
//   "nav.dashboard": "Dashboard",
//   "nav.users": "Users",
//   "nav.orders": "Orders",
//   "nav.analytics": "Analytics",
//   "nav.settings": "Settings",
//   welcome: "Welcome back",
//   subtitle: "Your product at a glance",
//   newFeature: "New feature",
//   activeUsers: "Active users",
//   usersValue: "48.2K",
//   peakValue: "12.4K",
//   performance: "Performance",
//   loadTime: "Load time",
//   loadValue: "0.8s",
//   uptime: "Uptime",
//   roadmap: "Release roadmap",
//   "features.payments": "Online payments",
//   "features.chat": "Live chat",
//   "features.mobile": "Mobile app",
//   "status.live": "Live",
//   "status.testing": "Testing",
//   "status.planned": "Planned",
// };

// function useAppText() {
//   const { t } = useTranslation();
//   return (key) => t(`hero.app.${key}`, { defaultValue: DEFAULTS[key] });
// }

// /*
//   Draws a fixed-size design, then scales it to whatever width its box has.
//   tan(atan2(100cqw, W)) is the CSS way to turn "container width / W" into the plain number
//   scale() needs, so there is no ResizeObserver, no layout shift and the text stays sharp.
// */
// function Scaled({ width, height, className, style, children, ...rest }) {
//   return (
//     <motion.div
//       className={className}
//       style={{ aspectRatio: `${width} / ${height}`, containerType: "inline-size", ...style }}
//       {...rest}
//     >
//       <div
//         className="absolute left-0 top-0 origin-top-left"
//         style={{ width, height, transform: `scale(tan(atan2(100cqw, ${width}px)))` }}
//       >
//         {children}
//       </div>
//     </motion.div>
//   );
// }

// function RoadmapStatus({ status, text }) {
//   return (
//     <span className="flex items-center gap-1.5 text-text-secondary">
//       <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} />
//       {text(`status.${status}`)}
//     </span>
//   );
// }

// function DashboardScreen({ live }) {
//   const text = useAppText();
//   const lastBar = BARS.length - 1;

//   return (
//     <div className="h-full w-full rounded-[30px] bg-[#0b1020] p-[11px] shadow-[0_70px_140px_-50px_var(--blue-electric)] ring-1 ring-white/10">
//       <div className="flex h-full overflow-hidden rounded-[20px] bg-surface text-text-primary">
//         {/* Sidebar */}
//         <div className="flex w-[188px] shrink-0 flex-col gap-1 border-e border-border p-4">
//           <div className="mb-5 flex items-center gap-2.5">
//             <span
//               className="grid size-8 place-items-center rounded-[10px] text-white"
//               style={{ backgroundImage: BRAND_GRADIENT }}
//             >
//               <Zap size={16} />
//             </span>
//             <span className="text-[13px] font-bold">{text("name")}</span>
//           </div>

//           {NAV.map(([id, Icon], i) => (
//             <div
//               key={id}
//               className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[12.5px] font-semibold ${
//                 i === 0 ? "text-brand-light" : "text-text-secondary"
//               }`}
//               style={i === 0 ? { backgroundColor: NAV_ACTIVE } : undefined}
//             >
//               <Icon size={16} />
//               {text(`nav.${id}`)}
//             </div>
//           ))}

//           <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-border p-2.5">
//             <span
//               className="size-7 shrink-0 rounded-full"
//               style={{ backgroundImage: USER_AVATAR_GRADIENT }}
//             />
//             <span className="flex flex-1 flex-col gap-1.5">
//               <span className="h-1.5 w-16 rounded-full bg-border" />
//               <span className="h-1.5 w-10 rounded-full bg-border opacity-60" />
//             </span>
//           </div>
//         </div>

//         {/* Main */}
//         <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-[17px] font-bold leading-tight">{text("welcome")}</p>
//               <p className="mt-1 text-[12px] text-text-secondary">{text("subtitle")}</p>
//             </div>
//             <div className="flex items-center gap-2.5">
//               <span className="grid size-9 place-items-center rounded-full border border-border text-text-secondary">
//                 <Search size={15} />
//               </span>
//               <span className="relative grid size-9 place-items-center rounded-full border border-border text-text-secondary">
//                 <Bell size={15} />
//                 <span className="absolute end-2.5 top-2.5 size-1.5 rounded-full bg-neon shadow-sm shadow-neon/50" />
//               </span>
//               <span className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--blue-electric)] px-4 text-[12px] font-semibold text-white">
//                 <Plus size={14} />
//                 {text("newFeature")}
//               </span>
//             </div>
//           </div>

//           <div className="grid h-[322px] grid-cols-[1.55fr_1fr] gap-4">
//             {/* Growth chart */}
//             <div className="flex flex-col rounded-2xl border border-border p-4">
//               <div className="flex items-center justify-between">
//                 <span className="flex items-center gap-2 text-[12.5px] font-semibold">
//                   <span className="grid size-6 place-items-center rounded-md bg-[var(--blue-electric)] text-white">
//                     <Users size={13} />
//                   </span>
//                   {text("activeUsers")}
//                 </span>
//                 <span className="grid size-6 place-items-center rounded-full border border-border text-text-secondary">
//                   <ArrowUpRight size={12} className="rtl:-scale-x-100" />
//                 </span>
//               </div>

//               <div className="mt-3 flex items-center gap-2">
//                 <span className="text-[28px] font-bold leading-none tracking-tight">
//                   {text("usersValue")}
//                 </span>
//                 <span className="rounded-md bg-neon/15 px-1.5 py-1 text-[11px] font-bold leading-none text-neon-ink dark:text-neon">
//                   +18.2%
//                 </span>
//               </div>

//               {/* Time always reads left to right, in Arabic too. */}
//               <div dir="ltr" className="relative mt-auto h-[188px]">
//                 <div className="absolute inset-x-0 bottom-0 top-9 flex flex-col justify-between">
//                   {[0, 1, 2, 3].map((line) => (
//                     <span key={line} className="border-t border-dashed border-border" />
//                   ))}
//                 </div>

//                 <div className="absolute inset-0 flex items-end gap-2">
//                   {BARS.map((value, i) => {
//                     const hot = i === lastBar;
//                     return (
//                       <div key={i} className="relative flex h-full flex-1 items-end">
//                         <motion.div
//                           className="w-full origin-bottom rounded-t-[7px]"
//                           style={{ height: `${value}%`, background: hot ? BAR_GRADIENT : SOFT_NEUTRAL }}
//                           initial={live ? { scaleY: 0 } : false}
//                           animate={{ scaleY: 1 }}
//                           transition={{ duration: 0.8, delay: 1.1 + i * 0.045, ease: EASE }}
//                         />

//                         {hot && (
//                           <div
//                             className="absolute inset-x-0 flex justify-center"
//                             style={{ bottom: `calc(${value}% + 10px)` }}
//                           >
//                             <motion.span
//                               className="relative rounded-lg bg-text-primary px-2.5 py-1.5 text-[11px] font-bold leading-none text-background"
//                               initial={live ? { opacity: 0, y: 8 } : false}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ duration: 0.5, delay: 2, ease: EASE }}
//                             >
//                               {text("peakValue")}
//                               <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[2px] bg-text-primary" />
//                             </motion.span>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="flex min-h-0 flex-col gap-4">
//               {/* Performance */}
//               <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
//                 <div className="relative size-[88px] shrink-0">
//                   <svg viewBox="0 0 100 100" className="size-full -rotate-90" focusable="false">
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="42"
//                       fill="none"
//                       stroke="var(--blue-light)"
//                       strokeOpacity="0.28"
//                       strokeWidth="10"
//                     />
//                     <motion.circle
//                       cx="50"
//                       cy="50"
//                       r="42"
//                       fill="none"
//                       stroke="var(--blue-bright)"
//                       strokeWidth="10"
//                       strokeLinecap="round"
//                       initial={live ? { pathLength: 0 } : false}
//                       animate={{ pathLength: 0.98 }}
//                       transition={{ duration: 1.2, delay: 1.3, ease: EASE }}
//                     />
//                   </svg>
//                   <span className="absolute inset-0 grid place-items-center text-[22px] font-bold">
//                     98
//                   </span>
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-[12.5px] font-semibold">{text("performance")}</p>
//                   <div className="mt-2 grid grid-cols-2 gap-x-4">
//                     <div>
//                       <p className="text-[11px] text-text-secondary">{text("loadTime")}</p>
//                       <p className="mt-0.5 text-[13px] font-bold">{text("loadValue")}</p>
//                     </div>
//                     <div>
//                       <p className="text-[11px] text-text-secondary">{text("uptime")}</p>
//                       <p className="mt-0.5 text-[13px] font-bold">99.9%</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Release roadmap */}
//               <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border p-4">
//                 <p className="text-[12.5px] font-semibold">{text("roadmap")}</p>
//                 <div className="mt-3 flex flex-1 flex-col justify-between">
//                   {ROADMAP.map(({ id, status, progress }, i) => (
//                     <div key={id}>
//                       <div className="flex items-center justify-between text-[11.5px]">
//                         <span className="font-semibold">{text(`features.${id}`)}</span>
//                         <RoadmapStatus status={status} text={text} />
//                       </div>
//                       <div
//                         className="mt-1.5 h-1.5 overflow-hidden rounded-full"
//                         style={{ backgroundColor: SOFT_NEUTRAL }}
//                       >
//                         <motion.div
//                           className="h-full origin-left rounded-full bg-[var(--blue-bright)] rtl:origin-right"
//                           style={{ width: `${progress}%` }}
//                           initial={live ? { scaleX: 0 } : false}
//                           animate={{ scaleX: 1 }}
//                           transition={{ duration: 0.9, delay: 1.5 + i * 0.12, ease: EASE }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent activity: placeholder rows, mostly hidden by the fade */}
//           <div className="flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-border px-4">
//             {["w-2/5", "w-1/3", "w-1/2"].map((width) => (
//               <div key={width} className="flex items-center gap-3">
//                 <span className="size-7 shrink-0 rounded-full bg-border" />
//                 <span className="flex flex-1 flex-col gap-1.5">
//                   <span className={`h-1.5 rounded-full bg-border ${width}`} />
//                   <span className="h-1.5 w-1/4 rounded-full bg-border opacity-60" />
//                 </span>
//                 <span className="h-5 w-14 rounded-full bg-border opacity-60" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PhoneScreen({ live }) {
//   const text = useAppText();

//   return (
//     <div className="h-full w-full rounded-[40px] bg-[#0b1020] p-[9px] shadow-[0_50px_90px_-30px_var(--blue-electric)] ring-1 ring-white/10">
//       <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[32px] bg-surface px-4 pb-4 pt-3 text-text-primary">
//         <div className="mx-auto h-[18px] w-[62px] shrink-0 rounded-full bg-[#0b1020]" />

//         <div className="flex items-center justify-between">
//           <p className="text-[13px] font-bold">{text("welcome")}</p>
//           <span className="relative grid size-7 place-items-center rounded-full border border-border text-text-secondary">
//             <Bell size={13} />
//             <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-neon shadow-sm shadow-neon/50" />
//           </span>
//         </div>

//         <div className="rounded-2xl p-3.5 text-white" style={{ backgroundImage: BRAND_GRADIENT }}>
//           <div className="flex items-center justify-between text-[10.5px] font-semibold">
//             <span className="opacity-90">{text("activeUsers")}</span>
//             <span className="rounded-full bg-white/20 px-1.5 py-0.5">+18.2%</span>
//           </div>
//           <p className="mt-1 text-[26px] font-bold leading-none tracking-tight">
//             {text("usersValue")}
//           </p>

//           <svg
//             viewBox="0 0 160 46"
//             className="mt-3 h-auto w-full overflow-visible rtl:-scale-x-100"
//             focusable="false"
//           >
//             <motion.path
//               d="M2 38C26 38 34 24 58 26C82 28 90 12 112 10C130 8 144 6 158 4"
//               fill="none"
//               stroke="var(--neon)"
//               strokeWidth="3"
//               strokeLinecap="round"
//               initial={live ? { pathLength: 0 } : false}
//               animate={{ pathLength: 1 }}
//               transition={{ duration: 1.2, delay: 1.7, ease: EASE }}
//             />
//             <motion.circle
//               cx="158"
//               cy="4"
//               r="4"
//               fill="var(--neon)"
//               initial={live ? { opacity: 0 } : false}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.4, delay: 2.8 }}
//             />
//           </svg>
//         </div>

//         {ROADMAP.slice(0, 2).map(({ id, status }) => (
//           <div
//             key={id}
//             className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-[11px]"
//           >
//             <span className="font-semibold">{text(`features.${id}`)}</span>
//             <RoadmapStatus status={status} text={text} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ---------- Hero ---------- */

// function HeroSection() {
//   const { t, i18n } = useTranslation();
//   const prefersReducedMotion = useReducedMotion();
//   const live = !prefersReducedMotion;

//   // Pointer position (0..1) drives a small 3D tilt. It only touches transforms.
//   const mx = useMotionValue(0.5);
//   const my = useMotionValue(0.5);
//   const sx = useSpring(mx, SPRING);
//   const sy = useSpring(my, SPRING);

//   // The stage rests turned toward its phone, on both LTR and RTL, and leans toward the pointer.
//   const restY = i18n.dir() === "rtl" ? -9 : 9;
//   const rotateY = useTransform(sx, [0, 1], [restY + 5, restY - 5]);
//   const rotateX = useTransform(sy, [0, 1], [8, 16]);

//   const handlePointerMove = (event) => {
//     if (!live || event.pointerType !== "mouse") return;
//     const rect = event.currentTarget.getBoundingClientRect();
//     mx.set((event.clientX - rect.left) / rect.width);
//     my.set((event.clientY - rect.top) / rect.height);
//   };

//   const handlePointerLeave = () => {
//     mx.set(0.5);
//     my.set(0.5);
//   };

//   const fade = (delay) => ({
//     initial: live ? { opacity: 0 } : false,
//     animate: { opacity: 1 },
//     transition: { duration: 0.9, delay, ease: EASE },
//   });

//   // Split by words only, never letters, so Arabic letters stay connected.
//   let order = 0;
//   const titleLines = [t("hero.titleLead"), t("hero.titleAccent")].map((line) =>
//     line.split(" ").map((word) => ({ word, order: order++ })),
//   );

//   return (
//     <section
//       aria-labelledby="home-hero-title"
//       onPointerMove={handlePointerMove}
//       onPointerLeave={handlePointerLeave}
//       className="relative isolate overflow-hidden bg-background"
//     >
//       <div aria-hidden="true" className="hero-section-wash pointer-events-none absolute inset-0" />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//         style={{ backgroundImage: SKY }}
//       />

//       <Container className="relative z-[1] pt-12 text-center sm:pt-16 lg:pt-20">
//         <motion.p
//           {...fade(0.1)}
//           className="mx-auto mb-5 flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-sm font-semibold text-brand-light rtl:tracking-normal"
//         >
//           <span aria-hidden="true" className="size-1.5 rounded-full bg-neon shadow-sm shadow-neon/50" />
//           {t("hero.eyebrow")}
//         </motion.p>

//         <h1
//           id="home-hero-title"
//           className="mx-auto max-w-4xl text-[clamp(2.4rem,5.2vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.045em] text-text-primary rtl:leading-[1.3] rtl:tracking-normal"
//         >
//           {titleLines.map((words, lineIndex) => (
//             <span key={lineIndex} className="block">
//               {words.map(({ word, order: i }) => (
//                 <Fragment key={`${word}-${i}`}>
//                   <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
//                     <motion.span
//                       className="inline-block"
//                       initial={live ? { y: "115%" } : false}
//                       animate={{ y: 0 }}
//                       transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: EASE }}
//                     >
//                       {word}
//                     </motion.span>
//                   </span>{" "}
//                 </Fragment>
//               ))}
//             </span>
//           ))}
//         </h1>

//         <motion.p
//           {...fade(0.6)}
//           className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-secondary sm:mt-6 sm:text-lg"
//         >
//           {t("hero.supportingText")}
//         </motion.p>

//         <motion.div
//           {...fade(0.75)}
//           className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center"
//         >
//           <Button
//             as={Link}
//             to={PROJECT_PATH}
//             className="min-h-12 w-full px-6 motion-reduce:transition-none sm:w-auto"
//           >
//             {t("common.startProject")}
//             <ArrowUpRight aria-hidden="true" size={18} className="rtl:-scale-x-100" />
//           </Button>

//           <Button
//             as={Link}
//             to="/work"
//             variant="outline"
//             className="min-h-12 w-full border-border bg-surface/60 px-6 hover:border-brand-bright hover:bg-surface motion-reduce:transition-none sm:w-auto"
//           >
//             {t("hero.exploreWork")}
//             <ArrowUpRight aria-hidden="true" size={18} className="rtl:-scale-x-100" />
//           </Button>
//         </motion.div>
//       </Container>

//       {/* The stage: cropped by the fold, dissolving into the page. Decorative only. */}
//       <div aria-hidden="true" className="relative z-[1] mt-10 overflow-hidden px-4 sm:mt-14">
//         <motion.div
//           className="relative mx-auto aspect-[1040/600] w-full max-w-[66rem] [perspective:1800px] sm:aspect-[1040/520]"
//           initial={live ? { opacity: 0, y: 80 } : false}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
//         >
//           <div className="hero-art-halo absolute inset-x-[8%] bottom-0 top-[2%]" />

//           <motion.div
//             className="absolute inset-0 [will-change:transform]"
//             style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
//           >
//             <Scaled width={1040} height={650} className="absolute end-0 top-[4%] w-[90%]">
//               <DashboardScreen live={live} />
//             </Scaled>

//             <Scaled
//               width={230}
//               height={470}
//               className="absolute start-0 top-[22%] w-[21%]"
//               style={{ z: 70 }}
//               initial={live ? { opacity: 0, y: 60 } : false}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 0.9, ease: EASE }}
//             >
//               <PhoneScreen live={live} />
//             </Scaled>
//           </motion.div>
//         </motion.div>

//         <div
//           className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-background"
//           style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
//         />
//       </div>
//     </section>
//   );
// }

// export default HeroSection;

// /*
//   New translation keys (add to your en / ar locale files).
//   Every key has an English fallback in DEFAULTS above, so nothing breaks while you add them.
//   The old hero.chips.* keys are no longer used and can be removed.

//   en:
//   "hero": {
//     "app": {
//       "name": "Your App",
//       "nav": {
//         "dashboard": "Dashboard",
//         "users": "Users",
//         "orders": "Orders",
//         "analytics": "Analytics",
//         "settings": "Settings"
//       },
//       "welcome": "Welcome back",
//       "subtitle": "Your product at a glance",
//       "newFeature": "New feature",
//       "activeUsers": "Active users",
//       "usersValue": "48.2K",
//       "peakValue": "12.4K",
//       "performance": "Performance",
//       "loadTime": "Load time",
//       "loadValue": "0.8s",
//       "uptime": "Uptime",
//       "roadmap": "Release roadmap",
//       "features": {
//         "payments": "Online payments",
//         "chat": "Live chat",
//         "mobile": "Mobile app"
//       },
//       "status": {
//         "live": "Live",
//         "testing": "Testing",
//         "planned": "Planned"
//       }
//     }
//   }

//   ar:
//   "hero": {
//     "app": {
//       "name": "تطبيقك",
//       "nav": {
//         "dashboard": "لوحة التحكم",
//         "users": "المستخدمون",
//         "orders": "الطلبات",
//         "analytics": "التحليلات",
//         "settings": "الإعدادات"
//       },
//       "welcome": "أهلًا بعودتك",
//       "subtitle": "منتجك في لمحة",
//       "newFeature": "ميزة جديدة",
//       "activeUsers": "المستخدمون النشطون",
//       "usersValue": "48.2 ألف",
//       "peakValue": "12.4 ألف",
//       "performance": "الأداء",
//       "loadTime": "زمن التحميل",
//       "loadValue": "0.8 ث",
//       "uptime": "التوافر",
//       "roadmap": "خطة الإصدارات",
//       "features": {
//         "payments": "الدفع الإلكتروني",
//         "chat": "الدردشة المباشرة",
//         "mobile": "تطبيق الموبايل"
//       },
//       "status": {
//         "live": "مُفعّل",
//         "testing": "قيد الاختبار",
//         "planned": "مُخطّط"
//       }
//     }
//   }

//   Optional: wording for the existing hero keys, so the text matches the web app message.

//   en:
//   "eyebrow": "Web apps built to grow",
//   "titleLead": "Turn your website into",
//   "titleAccent": "a web app that scales",
//   "supportingText": "We design and build dashboards, customer portals and SaaS platforms, then keep improving them as your business grows."

//   ar:
//   "eyebrow": "تطبيقات ويب مصمَّمة لتنمو",
//   "titleLead": "حوّل موقعك إلى",
//   "titleAccent": "تطبيق ويب يكبر معك",
//   "supportingText": "نصمّم ونبني لوحات التحكم وبوابات العملاء ومنصات SaaS، ثم نواصل تطويرها مع نمو أعمالك."
// */


// import { Fragment } from "react";
// import { motion, useReducedMotion } from "motion/react";
// import { useTranslation } from "react-i18next";

// import Badge from "../../../components/ui/Badge";
// import Container from "../../../components/ui/Container";
// import HeroServiceCards from "./HeroServiceCards";

/*
  Hero: a calm message on the start side, green glass blocks on the end side,
  and the three service cards below ("what do you want to build?").

  Performance: no images, no backdrop-filter, no blend modes, no loops.
  Glows, grid and blocks are painted once. Only the one-time intro moves.
  It pulls itself up by --navbar-height so its glow runs behind the transparent navbar.
*/

// const EASE = [0.22, 1, 0.36, 1];

// /* ---------- Static backdrop ---------- */

// const glowFor = (x) =>
//   [
//     `radial-gradient(46rem 30rem at ${x}% 0%, color-mix(in oklab, var(--brand) 20%, transparent), transparent 70%)`,
//     `radial-gradient(34rem 22rem at ${100 - x}% 100%, color-mix(in oklab, var(--brand-deep) 32%, transparent), transparent 70%)`,
//   ].join(", ");

// const gridFor = (x) => {
//   const line = "color-mix(in oklab, var(--text-primary) 7%, transparent)";
//   const mask = `radial-gradient(70% 62% at ${x}% 24%, #000 18%, transparent 76%)`;

//   return {
//     backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
//     backgroundSize: "64px 64px",
//     maskImage: mask,
//     WebkitMaskImage: mask,
//   };
// };

// /* ---------- Isometric glass blocks: three services, three blocks ---------- */

// function iso(cx, cy, size) {
//   const w = size * 0.866;
//   const point = (x, y) => `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`;

//   return {
//     top: [point(0, -size), point(w, -size / 2), point(0, 0), point(-w, -size / 2)].join(" "),
//     left: [point(-w, -size / 2), point(0, 0), point(0, size), point(-w, size / 2)].join(" "),
//     right: [point(w, -size / 2), point(w, size / 2), point(0, size), point(0, 0)].join(" "),
//   };
// }

// // Farthest first, so nearer blocks overlap them like glass.
// const CUBES = [
//   { cx: 372, cy: 150, size: 60, delay: 0.45 },
//   { cx: 250, cy: 250, size: 96, delay: 0.6 },
//   { cx: 130, cy: 330, size: 64, delay: 0.75 },
// ];

// function GlassBlocks({ live }) {
//   const edge = { stroke: "#fff", strokeOpacity: 0.4, strokeWidth: 1.25, strokeLinejoin: "round" };

//   return (
//     <svg viewBox="0 0 480 480" className="h-auto w-full overflow-visible" focusable="false">
//       <defs>
//         <linearGradient id="hero-face-top" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0" stopColor="color-mix(in oklab, var(--brand-bright) 40%, white)" stopOpacity="0.95" />
//           <stop offset="1" stopColor="var(--brand-bright)" stopOpacity="0.6" />
//         </linearGradient>
//         <linearGradient id="hero-face-left" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0" stopColor="var(--brand)" stopOpacity="0.9" />
//           <stop offset="1" stopColor="var(--brand-deep)" stopOpacity="0.95" />
//         </linearGradient>
//         <linearGradient id="hero-face-right" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0" stopColor="var(--brand-deep)" stopOpacity="0.95" />
//           <stop offset="1" stopColor="#052E1F" />
//         </linearGradient>
//       </defs>

//       {CUBES.map(({ cx, cy, size, delay }) => {
//         const faces = iso(cx, cy, size);

//         return (
//           <motion.g
//             key={cx}
//             initial={live ? { opacity: 0, y: 36 } : false}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay, ease: EASE }}
//           >
//             <polygon points={faces.left} fill="url(#hero-face-left)" {...edge} />
//             <polygon points={faces.right} fill="url(#hero-face-right)" {...edge} />
//             <polygon points={faces.top} fill="url(#hero-face-top)" {...edge} />
//           </motion.g>
//         );
//       })}
//     </svg>
//   );
// }

// /* ---------- Hero ---------- */

// function HeroSection() {
//   const { t, i18n } = useTranslation();
//   const prefersReducedMotion = useReducedMotion();
//   const live = !prefersReducedMotion;
//   const glowX = i18n.dir() === "rtl" ? 24 : 76;

//   const fade = (delay) => ({
//     initial: live ? { opacity: 0 } : false,
//     animate: { opacity: 1 },
//     transition: { duration: 0.9, delay, ease: EASE },
//   });

//   // Split by words only, never letters, so Arabic letters stay connected.
//   let order = 0;
//   const titleLines = [t("hero.titleLead"), t("hero.titleAccent")].map((line) =>
//     line.split(" ").map((word) => ({ word, order: order++ })),
//   );

//   return (
//     <section
//       aria-labelledby="home-hero-title"
//       className="relative isolate -mt-[var(--navbar-height)] overflow-hidden border-b border-border bg-background pt-[var(--navbar-height)]"
//     >
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//         style={{ backgroundImage: glowFor(glowX) }}
//       />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//         style={gridFor(glowX)}
//       />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute end-[-18%] top-[12%] w-[78vw] max-w-[34rem] opacity-40 sm:end-[-4%] sm:w-[46vw] sm:opacity-100 lg:end-[3%] rtl:-scale-x-100"
//       >
//         <GlassBlocks live={live} />
//       </div>

//       <Container className="relative z-[1] pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pt-24">
//         <div className="max-w-3xl">
//           <motion.div {...fade(0.1)} className="mb-6">
//             <Badge variant="neon" className="gap-2">
//               <span
//                 aria-hidden="true"
//                 className="size-1.5 rounded-full bg-neon shadow-sm shadow-neon/50"
//               />
//               {t("hero.eyebrow")}
//             </Badge>
//           </motion.div>

//           <h1
//             id="home-hero-title"
//             className="text-[clamp(2.5rem,5.6vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.045em] text-text-primary rtl:leading-[1.3] rtl:tracking-normal"
//           >
//             {titleLines.map((words, lineIndex) => (
//               <span
//                 key={lineIndex}
//                 className={lineIndex === 1 ? "block text-neon-ink" : "block"}
//               >
//                 {words.map(({ word, order: i }) => (
//                   <Fragment key={`${word}-${i}`}>
//                     <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
//                       <motion.span
//                         className="inline-block"
//                         initial={live ? { y: "115%" } : false}
//                         animate={{ y: 0 }}
//                         transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: EASE }}
//                       >
//                         {word}
//                       </motion.span>
//                     </span>{" "}
//                   </Fragment>
//                 ))}
//               </span>
//             ))}
//           </h1>

//           <motion.p
//             {...fade(0.6)}
//             className="mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg"
//           >
//             {t("hero.supportingText")}
//           </motion.p>
//         </div>

//         <HeroServiceCards className="mt-12 sm:mt-14" />
//       </Container>
//     </section>
//   );
// }

// export default HeroSection;



import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import Container from "../../../components/ui/Container";
import contact from "../../../config/contact";
import getSafeExternalUrl from "../../../lib/getSafeExternalUrl";
import SOCIAL_ICONS from "../../../lib/socialIcons";
import HeroCardsRail from "./HeroCardsRail";

/*
  Hero, "cards hanging on a string" style: a kinetic opening line, a centred message with one button,
  then the draggable rail of featured service cards (HeroCardsRail) and its link into the full
  catalogue. From xl up, the social profiles run down a hairline rail in the hero's side gutter.

  Performance: no images, no backdrop-filter, no blend modes, no SVG filters. The glow is a plain
  gradient painted once. The only motion is the one-time intro, the word rotation and the rail's own
  loop, which stops while it is off screen. The section pulls itself up by --navbar-height so the glow
  runs behind the transparent navbar.
*/

const EASE = [0.22, 1, 0.36, 1];

// Same route the category pills and the cards use.
const SERVICES_PATH = "/services";

/* ---------- Static backdrop: soft light at the top, brand glows in the bottom corners ---------- */

const GLOW = [
  "radial-gradient(54rem 26rem at 50% 0%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 70%)",
  "radial-gradient(40rem 26rem at 100% 100%, color-mix(in oklab, var(--brand) 24%, transparent), transparent 70%)",
  "radial-gradient(36rem 24rem at 0% 100%, color-mix(in oklab, var(--brand-deep) 26%, transparent), transparent 70%)",
].join(", ");

/* ---------- Social rail: a hairline in the hero's side gutter, from xl up ---------- */

// The profiles come from src/config/contact.js — the same list the footer
// renders, so adding or removing a network in the config moves both places at
// once. The glyphs live in src/lib/socialIcons.js, shared with the footer so
// the two render identical marks.
const SOCIALS = (Array.isArray(contact.socialLinks) ? contact.socialLinks : [])
  .map((item) => ({
    id: item.id,
    label: item.label,
    href: getSafeExternalUrl(item.url),
    paths: SOCIAL_ICONS[item.id],
  }))
  .filter((item) => item.href && item.paths && item.label);

/* ---------- Kinetic opening line: the studio's verbs, one at a time ---------- */

// The order is structure, so it lives here; the words themselves come from the
// locale files (hero.kinetic.*).
const KINETIC_WORDS = ["create", "launch", "design", "develop"];
const WORD_INTERVAL = 2400;

function KineticWords() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((current) => (current + 1) % KINETIC_WORDS.length),
      WORD_INTERVAL,
    );

    return () => clearInterval(timer);
  }, []);

  // The widest label reserves the box, so the line never resizes — or clips a
  // word — as the rotation runs, and it holds in both languages.
  const labels = KINETIC_WORDS.map((key) => t(`hero.kinetic.${key}`));
  const widest = labels.reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    "",
  );

  return (
    <span
      aria-hidden="true"
      className="relative block h-[1.6em] overflow-hidden text-[clamp(1.1rem,2vw,1.5rem)] font-semibold leading-none text-accent-light ltr:uppercase ltr:tracking-[0.18em] rtl:tracking-normal"
    >
      <span className="invisible whitespace-nowrap">{widest}</span>

      {KINETIC_WORDS.map((key, index) => {
        // One word is on stage; the next waits just below the mask and the rest
        // rest above it, so the rotation reads as one small, quiet movement.
        const offset = (index - active + KINETIC_WORDS.length) % KINETIC_WORDS.length;
        const step = offset === 0 ? 0 : offset === 1 ? 1 : -1;

        return (
          <motion.span
            key={key}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
            initial={false}
            animate={{ y: `${step * 55}%`, opacity: step === 0 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {t(`hero.kinetic.${key}`)}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ---------- Social rail ---------- */

function SocialRail({ live }) {
  const { t } = useTranslation();

  if (SOCIALS.length === 0) {
    return null;
  }

  // Upper-middle of the hero: clear of the copy above and the card rail below,
  // so it complements the composition instead of crossing it.
  return (
    <nav
      aria-label={t("hero.socialLabel")}
      className="pointer-events-none absolute inset-x-0 top-[38%] z-[2] hidden -translate-y-1/2 xl:block"
    >
      <Container className="flex justify-end">
        <motion.ul
          initial={live ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="pointer-events-auto relative flex flex-col items-center gap-1 ps-3"
        >
          <span aria-hidden="true" className="absolute inset-y-4 start-0 w-px bg-border" />

          {SOCIALS.map(({ id, label, href, paths }) => (
            <li key={id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full text-text-secondary outline-offset-2 transition-colors duration-200 hover:bg-accent-soft hover:text-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon motion-reduce:transition-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[17px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  {paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </a>
            </li>
          ))}
        </motion.ul>
      </Container>
    </nav>
  );
}

/* ---------- Hero ---------- */

function HeroSection() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const live = !prefersReducedMotion;

  const fade = (delay) => ({
    initial: live ? { opacity: 0 } : false,
    animate: { opacity: 1 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  // Split by words only, never letters, so Arabic letters stay connected.
  let order = 0;
  const titleLines = [t("hero.titleLead"), t("hero.titleAccent")].map((line) =>
    line.split(" ").map((word) => ({ word, order: order++ })),
  );

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate -mt-[var(--navbar-height)] overflow-clip border-b border-border bg-background pt-[var(--navbar-height)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: GLOW }}
      />

      <SocialRail live={live} />

      <Container className="relative z-[1] pt-[4.5rem] sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* The studio's verbs replace the old static label. A marker and a
              hairline drawn out of it point at the word that is changing, so the
              line reads as one editorial element rather than a flashy effect.
              Reduced motion keeps the plain label — same information, no rotation. */}
          <motion.div {...fade(0.1)} className="mb-6 flex items-center justify-center gap-3">
            {live ? (
              <>
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
                <span
                  aria-hidden="true"
                  className="h-px w-7 shrink-0 bg-linear-to-r from-accent/60 to-transparent rtl:-scale-x-100 sm:w-9"
                />
                <span className="sr-only">{t("hero.eyebrow")}</span>
                <KineticWords />
              </>
            ) : (
              <span className="text-small font-semibold uppercase tracking-[0.2em] text-text-secondary rtl:tracking-normal">
                {t("hero.eyebrow")}
              </span>
            )}
          </motion.div>

          {/* ltr:uppercase gives English the heavy all-caps look; remove it if you prefer sentence case. */}
          <h1
            id="home-hero-title"
            className="text-[clamp(2.5rem,6.6vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em] text-text-primary ltr:uppercase rtl:leading-[1.3] rtl:tracking-normal"
          >
            {titleLines.map((words, lineIndex) => (
              <span
                key={lineIndex}
                className={lineIndex === 1 ? "block text-neon-ink" : "block"}
              >
                {words.map(({ word, order: i }) => (
                  <Fragment key={`${word}-${i}`}>
                    <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={live ? { y: "115%" } : false}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: EASE }}
                      >
                        {word}
                      </motion.span>
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            {...fade(0.6)}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-text-secondary sm:text-lg"
          >
            {t("hero.supportingText")}
          </motion.p>

          <motion.div {...fade(0.75)} className="mt-9 flex justify-center">
            <Link
              to={SERVICES_PATH}
              className="group inline-flex items-center gap-3 rounded-full bg-text-primary py-2 ps-7 pe-2 text-base font-semibold text-background shadow-[0_14px_34px_-14px_color-mix(in_oklab,var(--brand)_70%,transparent)] outline-offset-4 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {t("hero.primaryCta")}
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-full bg-background text-text-primary"
              >
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </motion.div>
        </div>
      </Container>

      <motion.div {...fade(0.9)} className="relative z-[1] pb-4 sm:pb-8">
        <HeroCardsRail />
      </motion.div>
    </section>
  );
}

export default HeroSection;
