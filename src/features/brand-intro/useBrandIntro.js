import { useContext } from "react";

import BrandIntroContext from "./BrandIntroContext";

function useBrandIntro() {
  const context = useContext(BrandIntroContext);

  if (!context) {
    throw new Error("useBrandIntro must be used inside BrandIntroProvider");
  }

  return context;
}

export default useBrandIntro;
