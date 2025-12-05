const API_KEY = import.meta.env.VITE_OMDB_KEY as string;
const BASE_URL = "https://www.omdbapi.com/";

export type MovieSearchItem = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string; // "movie" | "series" | etc
};

export async function searchMovies(query: string): Promise<MovieSearchItem[]> {
  if (!API_KEY) {
    throw new Error("Missing OMDb API key");
  }

  const res = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    throw new Error("Network error");
  }

  const data = await res.json();

  if (data.Response === "False") {
    // no results or OMDb error message
    return [];
  }

  return data.Search as MovieSearchItem[];
}
