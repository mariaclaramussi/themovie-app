import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../schemas/env.schema";

export const baseQuery = fetchBaseQuery({
  baseUrl: env.REACT_APP_TMDB_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams(params);
    if (!searchParams.has("api_key")) {
      searchParams.set("api_key", env.REACT_APP_TMDB_API_KEY);
    }
    return searchParams.toString();
  },
});
