import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieById, type MovieDetail } from "../api/movieApi";

const FEATURED_IDS = [
  "tt0103064", // Terminator 2
  "tt0088247", // Terminator
  "tt0241527", // Harry Potter 1
  "tt0372784", // Batman Begins
  "tt0848228", // The Avengers
  "tt0133093", // The Matrix
  "tt0120737", // LOTR: Fellowship
  "tt0111161", // Shawshank
  "tt0468569", // Dark Knight
];

function pickRandom(ids: string[], count: number) {
  const shuffled = [...ids].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function HomePage() {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadFeatured() {
    try {
      setLoading(true);
      setError(null);

      const picked = pickRandom(FEATURED_IDS, 6); // show 6 cards (2 rows on desktop)

      const results = await Promise.all(
        picked.map(async (id) => {
          try {
            return await getMovieById(id);
          } catch {
            return null;
          }
        })
      );

      setMovies(results.filter((m): m is MovieDetail => m !== null));
    } catch {
      setError("Failed to load featured movies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <div>
      <div className="home__top">
        <div>
          <h1 className="home__title">Featured picks</h1>
          <p className="home__subtitle">Random picks every time. Hit refresh for new ones.</p>
        </div>

        <button className="home__refresh" onClick={loadFeatured} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="movie-grid movie-grid--home">
        {movies.map((m) => (
          <Link key={m.imdbID} to={`/movie/${m.imdbID}`} className="movie-card-list-item">
            {m.Poster !== "N/A" ? (
              <img className="movie-card-list-item__poster" src={m.Poster} alt={m.Title} />
            ) : (
              <div className="movie-card-list-item__poster movie-card-list-item__poster--placeholder">
                ?
              </div>
            )}

            <div className="movie-card-list-item__info">
              <h3>{m.Title}</h3>
              <p className="movie-card-list-item__meta">
                {m.Year}
                {m.imdbRating && m.imdbRating !== "N/A" ? ` • IMDb ${m.imdbRating}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {!loading && !error && movies.length === 0 && (
        <p className="muted">No featured movies available.</p>
      )}
    </div>
  );
}
