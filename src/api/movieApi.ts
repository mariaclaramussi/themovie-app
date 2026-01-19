import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AddRatingRequest,
  AddRatingResponse,
  MovieDetails,
  MovieListResponse,
} from "../types/movie";
import { baseQuery } from "./baseApi";
import { env } from "../schemas/env.schema";

const API_KEY = env.REACT_APP_TMDB_API_KEY;

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery,
  endpoints: (builder) => ({
    getMoviesByCategory: builder.query<
      MovieListResponse,
      { category: string; page?: number }
    >({
      query: ({ category, page = 1 }) =>
        `/movie/${category}?api_key=${API_KEY}&language=pt-BR&page=${page}`,
    }),
    getMovieDetails: builder.query<
      MovieDetails,
      { id: number; language?: string }
    >({
      query: ({ id, language = "pt-BR" }) => ({
        url: `/movie/${id}?api_key=${API_KEY}`,
        params: { language },
      }),
      keepUnusedDataFor: 300,
    }),
    addMovieRating: builder.mutation<AddRatingResponse, AddRatingRequest>({
      query: ({ movieId, value, sessionId }) => ({
        url: `/movie/${movieId}/rating?api_key=${API_KEY}`,
        method: "POST",
        params: { session_id: sessionId },
        body: { value },
      }),
    }),
    getMovieAccountStates: builder.query<
      {
        id: number;
        favorite: boolean;
        watchlist: boolean;
        rated: { value: number } | boolean;
      },
      { movieId: number; sessionId: string }
    >({
      query: ({ movieId, sessionId }) => ({
        url: `/movie/${movieId}/account_states`,
        params: { session_id: sessionId },
      }),
    }),
  }),
});

export const {
  useGetMoviesByCategoryQuery,
  useLazyGetMovieDetailsQuery,
  useAddMovieRatingMutation,
  useGetMovieAccountStatesQuery,
} = moviesApi;
