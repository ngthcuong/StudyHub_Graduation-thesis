import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { setupListeners } from "@reduxjs/toolkit/query";

import certificateReducer from "./slices/certificate";
import snackbarReducer from "./slices/snackbar";
import authReducer from "./slices/auth";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["certificate", "snackbar"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    certificate: certificateReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
