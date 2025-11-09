import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams(params);
    if (!searchParams.has("api_key")) {
      searchParams.set("api_key", API_KEY ?? "");
    }
    return searchParams.toString();
  },
});
