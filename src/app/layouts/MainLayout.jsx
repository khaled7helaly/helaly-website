import { Outlet, ScrollRestoration } from "react-router";
import { Suspense, useEffect, useRef } from "react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import BrandIntro from "../../features/brand-intro/BrandIntro";
import BrandIntroProvider from "../../features/brand-intro/BrandIntroProvider";
import useBrandIntro from "../../features/brand-intro/useBrandIntro";

function MainLayoutContent() {
  const { isIntroActive } = useBrandIntro();
  const wasIntroActive = useRef(isIntroActive);
  const brandWordmarkRef = useRef(null);

  useEffect(() => {
    if (wasIntroActive.current && !isIntroActive) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }

    wasIntroActive.current = isIntroActive;
  }, [isIntroActive]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div aria-hidden={isIntroActive} inert={isIntroActive}>
        <Navbar
          brandWordmarkRef={brandWordmarkRef}
          isBrandWordmarkHidden={isIntroActive}
        />
        <Breadcrumbs />

        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <Suspense fallback={<div className="min-h-[40vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>

      <BrandIntro wordmarkTargetRef={brandWordmarkRef} />
      <ScrollRestoration />
    </div>
  );
}

function MainLayout() {
  return (
    <BrandIntroProvider>
      <MainLayoutContent />
    </BrandIntroProvider>
  );
}

export default MainLayout;
