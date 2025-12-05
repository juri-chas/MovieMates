import { useState } from "react";
import type { FormEvent } from "react";
import { searchMovies, type MovieSearchItem } from "../api/movieApi";


export function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const result = await searchMovies(query);
      setMovies(result);
    } catch (err) {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No results yet. Try searching for something.</p>
      )}

      <ul>
        {movies.map((m) => (
          <li key={m.imdbID}>
            {m.Title} ({m.Year})
          </li>
        ))}
      </ul>
    </div>
  );
}
