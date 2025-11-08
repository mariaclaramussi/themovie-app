import { configureStore } from "@reduxjs/toolkit";
import { tmdbAuthApi } from "../api/tmdbAuth";
import { baseApi } from "../api/baseApi";

export const store = configureStore({
  reducer: {
    [tmdbAuthApi.reducerPath]: tmdbAuthApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbAuthApi.middleware, baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
