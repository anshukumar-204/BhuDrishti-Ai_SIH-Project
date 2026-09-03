import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LandProvider } from "./context/LandContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LandProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LandProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
