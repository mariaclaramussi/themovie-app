import { configureStore } from "@reduxjs/toolkit";
import { tmdbAuthApi } from "../api/tmdbAuth";
import { moviesApi } from "../api/movieApi";

export const store = configureStore({
  reducer: {
    [tmdbAuthApi.reducerPath]: tmdbAuthApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbAuthApi.middleware, moviesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
