import { createApi } from "@reduxjs/toolkit/query/react";
import { MovieDetails, MovieListResponse } from "../types/movie";
import { baseQuery } from "./baseApi";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery,
  endpoints: (builder) => ({
    getMoviesByCategory: builder.query<MovieListResponse, { category: string }>(
      {
        query: ({ category }) =>
          `/movie/${category}?api_key=${API_KEY}&language=pt-BR&page=1`,
      }
    ),
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

export const { useGetMoviesByCategoryQuery, useLazyGetMovieDetailsQuery } =
  moviesApi;
