import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";
import { ThemeProvider } from "./components/ui/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
