import { useCallback, useMemo, useState } from "react";

import { BRAND_INTRO_STORAGE_KEY } from "./brandIntro.constants";
import BrandIntroContext from "./BrandIntroContext";

function shouldShowBrandIntro() {
  if (typeof window === "undefined") return false;

  try {
    if (window.localStorage.getItem(BRAND_INTRO_STORAGE_KEY) === "true") {
      return false;
    }
  } catch {
    // If storage is blocked, skip the intro so it cannot trap the visitor.
    return false;
  }

  return true;
}

function BrandIntroProvider({ children }) {
  const [isIntroActive, setIsIntroActive] = useState(shouldShowBrandIntro);

  const completeIntro = useCallback(() => {
    try {
      window.localStorage.setItem(BRAND_INTRO_STORAGE_KEY, "true");
    } catch {
      // The intro still closes for this visit when storage is unavailable.
    }

    setIsIntroActive(false);
  }, []);

  const value = useMemo(
    () => ({ isIntroActive, completeIntro }),
    [isIntroActive, completeIntro],
  );

  return (
    <BrandIntroContext.Provider value={value}>
      {children}
    </BrandIntroContext.Provider>
  );
}

export default BrandIntroProvider;
