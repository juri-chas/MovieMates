import { useState } from "react";
import type { FormEvent } from "react";
import {
  searchMovies,
  getMovieById,
  type MovieSearchItem,
  type MovieDetail,
} from "../api/movieApi";
import { MovieCard } from "../components/MovieCard";

type RatingsById = Record<string, number | null>;

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieSearchItem[]>([]);
  const [ratings, setRatings] = useState<RatingsById>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setMovies([]);
      setRatings({});

      const result = await searchMovies(query);
      setMovies(result);

      // fetch details for each movie to get imdbRating
      const details: Array<MovieDetail | null> = await Promise.all(
        result.map(async (m) => {
          try {
            return await getMovieById(m.imdbID);
          } catch {
            return null;
          }
        })
      );

      const ratingMap: RatingsById = {};
      for (const d of details) {
        if (!d) continue;
        const num =
          d.imdbRating && d.imdbRating !== "N/A"
            ? parseFloat(d.imdbRating)
            : null;
        ratingMap[d.imdbID] = Number.isNaN(num as number) ? null : num;
      }
      setRatings(ratingMap);
    } catch (err) {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }

  const hasResults = !loading && !error && movies.length > 0;

  return (
    <div>
      <h1>Search</h1>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        Find a movie or series, then open it to see details and reviews.
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p style={{ marginTop: 16 }}>Loading...</p>}

      {error && (
        <p style={{ marginTop: 16, color: "#f97316" }}>{error}</p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p style={{ marginTop: 16 }}>
          No results yet. Try searching for something.
        </p>
      )}

      {hasResults && (
        <>
          <p style={{ marginTop: 16, opacity: 0.8 }}>
            Found {movies.length} result{movies.length > 1 ? "s" : ""}.
          </p>
          <div className="movie-grid">
            {movies.map((m) => (
              <MovieCard
                key={m.imdbID}
                movie={m}
                generalRating={ratings[m.imdbID] ?? null} // IMDb as Global
                userRating={null} // later
                friendsRating={null} // later
                friendsCount={null} // later
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
