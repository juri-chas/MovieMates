import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";


import App from "./App.tsx";
import {AuthContext } from "./context/AuthContext.tsx";

const authValue = { user: null, login: () => {}, logout: () => {} }; // shape must match AuthContextType

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        <App />
      </AuthContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
