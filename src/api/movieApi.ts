const API_KEY = import.meta.env.VITE_OMDB_KEY as string | undefined;
const BASE_URL = "https://www.omdbapi.com/";

// Light-weight movie type used in search results
export type MovieSearchItem = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string; // "movie" | "series" | "episode" etc
};

// Rating entry from OMDb detail endpoint
export type OmdbRating = {
  Source: string; // e.g. "Internet Movie Database"
  Value: string;  // e.g. "8.2/10" or "84%"
};

// Full movie details used on MovieDetailPage
export type MovieDetail = {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  imdbRating: string;   // "8.2" or "N/A"
  Genre: string;
  Rated?: string;
  Runtime: string;
  Ratings?: OmdbRating[]; // extra sources like Rotten Tomatoes, Metacritic etc
};

// Internal helper to do fetch + basic error handling
async function request<T>(url: string): Promise<T> {
  if (!API_KEY) {
    throw new Error("Missing OMDb API key");
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Network error");
  }

  const data = await res.json();

  if (data.Response === "False") {
    // OMDb returns Response: "False" with an Error field in many cases
    const message = (data as { Error?: string }).Error ?? "Request failed";
    throw new Error(message);
  }

  return data as T;
}

// Search movies/series by text query (used on SearchPage)
export async function searchMovies(query: string): Promise<MovieSearchItem[]> {
  if (!query.trim()) return [];

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const data = await request<{ Search?: MovieSearchItem[] }>(url);

  // If Search is missing, just return empty list
  return data.Search ?? [];
}

// Get full details for a single movie by IMDb id (used on MovieDetailPage)
export async function getMovieById(id?: string): Promise<MovieDetail> {
  if (!id) {
    throw new Error("Missing movie id");
  }

  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(
    id
  )}&plot=full`;

  const data = await request<MovieDetail>(url);
  return data;
}
