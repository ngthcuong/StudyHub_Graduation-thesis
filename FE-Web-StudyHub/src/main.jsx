import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "../src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CircularProgress } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<CircularProgress />} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
