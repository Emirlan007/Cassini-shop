import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store.ts";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";
import { axiosApi } from "./axiosApi.ts";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import "./i18n.ts";

axiosApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.users.user?.token;

  if (token && config.headers) {
    config.headers.Authorization = token;
  }

  const sessionId = getSessionId();

  config.headers["Session-Id"] = sessionId;

  return config;
});

const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <HelmetProvider>
            <CssBaseline />
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
