import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useGetAccountDetailsQuery,
  useGetFavoriteMoviesQuery,
  useMarkAsFavoriteMutation,
} from "../api/accountApi";
import { getValidSessionId } from "../schemas/session.schema";

interface AccountContextProps {
  accountId?: string;
  sessionId?: string;
  accountDetails?: any;
  favoriteMovies?: any;
  isLoading: boolean;
  error?: any;
  toggleFavorite: (mediaId: number, isFavorite: boolean) => Promise<boolean>;
}

const AccountContext = createContext<AccountContextProps | undefined>(
  undefined
);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionId] = useState<string | undefined>(
    () => getValidSessionId() || undefined
  );
  const [accountId, setAccountId] = useState<string | undefined>(undefined);

  const {
    data: accountDetails,
    isLoading: isAccountLoading,
    error: accountError,
  } = useGetAccountDetailsQuery(
    { sessionId: sessionId! },
    { skip: !sessionId }
  );

  useEffect(() => {
    if (accountDetails?.id) {
      setAccountId(accountDetails.id.toString());
    }
  }, [accountDetails]);

  const {
    data: favoriteMovies,
    isLoading: isFavoritesLoading,
    refetch: refetchFavorites,
  } = useGetFavoriteMoviesQuery(
    { accountId: accountId as string, sessionId: sessionId! },
    { skip: !accountId || !sessionId }
  );

  const [markAsFavorite] = useMarkAsFavoriteMutation();

  const toggleFavorite = async (mediaId: number, isFavorite: boolean): Promise<boolean> => {
    if (!sessionId) return false;
    try {
      await markAsFavorite({
        accountId: accountId!,
        sessionId,
        mediaId,
        favorite: !isFavorite,
      }).unwrap();
      refetchFavorites();
      return true;
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
      return false;
    }
  };

  const isLoading = isAccountLoading || isFavoritesLoading;

  return (
    <AccountContext.Provider
      value={{
        accountId,
        sessionId,
        accountDetails,
        favoriteMovies,
        isLoading,
        error: accountError,
        toggleFavorite,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = (): AccountContextProps => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error(
      "useAccountContext deve ser usado dentro de AccountProvider"
    );
  }
  return context;
};
