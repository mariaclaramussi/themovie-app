import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MovieDetails, MovieListResponse } from "../types/movie";

const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopRatedMovies: builder.query<
      MovieListResponse,
      { page?: number; language?: string }
    >({
      query: ({ page = 1, language = "pt-BR" }) =>
        `/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
    }),
    getPopularMovies: builder.query<
      MovieListResponse,
      { page?: number; language?: string }
    >({
      query: ({ page = 1, language = "pt-BR" }) =>
        `/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`,
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
  }),
});

export const {
  useGetTopRatedMoviesQuery,
  useGetPopularMoviesQuery,
  useLazyGetMovieDetailsQuery,
} = moviesApi;
