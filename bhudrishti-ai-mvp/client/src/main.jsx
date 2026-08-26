import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LandProvider } from "./context/LandContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LandProvider>
        <App />
      </LandProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
