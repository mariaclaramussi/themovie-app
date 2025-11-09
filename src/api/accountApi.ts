import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";
import {
  FavoriteMoviesResponse,
  MarkFavoriteResponse,
  MarkFavoriteRequest,
  AccountDetails,
} from "../types/account";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery,
  endpoints: (builder) => ({
    getAccountDetails: builder.query<AccountDetails, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: "/account",
        params: { session_id: sessionId },
      }),
    }),
    getFavoriteMovies: builder.query<
      FavoriteMoviesResponse,
      { accountId: string; sessionId: string }
    >({
      query: ({ accountId, sessionId }) => ({
        url: `/account/${accountId || "account"}/favorite/movies`,
        params: { language: "pt-BR", session_id: sessionId },
      }),
    }),
    markAsFavorite: builder.mutation<MarkFavoriteResponse, MarkFavoriteRequest>(
      {
        query: ({ accountId, mediaId, favorite, sessionId }) => ({
          url: `/account/${accountId || "account"}/favorite`,
          method: "POST",
          body: {
            media_type: "movie",
            media_id: mediaId,
            favorite,
          },
          params: { session_id: sessionId },
        }),
      }
    ),
  }),
});

export const {
  useGetAccountDetailsQuery,
  useGetFavoriteMoviesQuery,
  useMarkAsFavoriteMutation,
} = accountApi;
