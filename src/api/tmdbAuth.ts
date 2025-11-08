import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const tmdbAuthApi = createApi({
  reducerPath: "tmdbAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createRequestToken: builder.mutation<{ request_token: string }, void>({
      query: () => ({
        url: `/authentication/token/new?api_key=${API_KEY}`,
        method: "GET",
      }),
    }),
    createSession: builder.mutation<
      { session_id: string },
      { request_token: string }
    >({
      query: ({ request_token }) => ({
        url: `/authentication/session/new?api_key=${API_KEY}`,
        method: "POST",
        body: { request_token },
      }),
    }),
    deleteSession: builder.mutation<
      { success: boolean },
      { session_id: string }
    >({
      query: ({ session_id }) => ({
        url: `/authentication/session?api_key=${API_KEY}`,
        method: "DELETE",
        body: { session_id },
      }),
    }),
  }),
});

export const {
  useCreateRequestTokenMutation,
  useCreateSessionMutation,
  useDeleteSessionMutation,
} = tmdbAuthApi;
