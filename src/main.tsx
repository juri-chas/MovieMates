import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.tsx";
import { AuthContext } from "./context/AuthContext.tsx";

const authValue = { user: null, login: () => {}, logout: () => {} }; // shape must match AuthContextType

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContext.Provider>
      <App />
      </AuthContext.Provider>
    </BrowserRouter>
  </StrictMode>
);
