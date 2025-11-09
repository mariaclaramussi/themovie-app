export interface AccountDetails {
  id: number;
  name: string;
  username: string;
}

export interface FavoriteMoviesResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

export interface MarkFavoriteRequest {
  accountId: string;
  mediaId: number;
  favorite: boolean;
  sessionId: string;
}

export interface MarkFavoriteResponse {
  success: boolean;
  status_code: number;
  status_message: string;
}
