import { configureStore } from "@reduxjs/toolkit";
import { tmdbAuthApi } from "../api/tmdbAuth";
import { moviesApi } from "../api/movieApi";
import { accountApi } from "../api/accountApi";

export const store = configureStore({
  reducer: {
    [tmdbAuthApi.reducerPath]: tmdbAuthApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tmdbAuthApi.middleware,
      moviesApi.middleware,
      accountApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
