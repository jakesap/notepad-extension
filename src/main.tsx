import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Popup />
      </SidebarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
