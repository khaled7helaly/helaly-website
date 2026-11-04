import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./styles/index.css";
import "./i18n/index.js";

import "@fontsource-variable/manrope";
import "@fontsource-variable/cairo";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);