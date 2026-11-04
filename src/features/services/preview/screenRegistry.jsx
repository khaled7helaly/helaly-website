import {
  AnalyticsScreen,
  BusinessScreen,
  DashboardScreen,
  DesignSystemScreen,
  LandingScreen,
  MobileScreen,
  PortfolioScreen,
  SocialScreen,
  StoreScreen,
  WireframeScreen,
} from "./screenLayouts";

/**
 * Layout registry.
 *
 * Kept apart from the layouts so that screenLayouts.jsx exports nothing but
 * components — React Fast Refresh only works on component-only modules.
 *
 * A layout id is shared by every service with the same kind of deliverable;
 * `variant` and `accentIndex` (see ./previewMap.js) are what keep those
 * services visually distinct.
 */

const SCREENS = {
  business: BusinessScreen,
  portfolio: PortfolioScreen,
  store: StoreScreen,
  landing: LandingScreen,
  dashboard: DashboardScreen,
  analytics: AnalyticsScreen,
  designSystem: DesignSystemScreen,
  mobile: MobileScreen,
  social: SocialScreen,
  wireframe: WireframeScreen,
};

const DEFAULT_SCREEN = "business";

/**
 * Renders the screen for a layout id.
 *
 * Returns the element instead of the component so the lookup stays inside the
 * registry: an unknown layout falls back to the default screen rather than
 * handing an undefined component to a render pass.
 */
export function renderScreen(layout, props) {
  const Screen = SCREENS[layout] || SCREENS[DEFAULT_SCREEN];
  return <Screen {...props} />;
}
