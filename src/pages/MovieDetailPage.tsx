import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, type MovieDetail } from "../api/movieApi";

export function MovieDetailPage() {
  const { id } = useParams(); // id comes from /movie/:id

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p>Loading movie...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div>
      <h1>
        {movie.Title} ({movie.Year})
      </h1>
      {movie.Poster !== "N/A" && (
        <img
          src={movie.Poster}
          alt={movie.Title}
          style={{ maxWidth: "200px", display: "block", marginBottom: "1rem" }}
        />
      )}
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Runtime:</strong> {movie.Runtime}</p>
      <p><strong>IMDb rating:</strong> {movie.imdbRating}</p>
      <p style={{ marginTop: "1rem" }}>{movie.Plot}</p>
    </div>
  );
}
