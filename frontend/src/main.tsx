import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Global styles
import { DarkModeProvider } from "./context/DarkModeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DarkModeProvider>

    <BrowserRouter>
      <App />
    </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);
