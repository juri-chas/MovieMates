import { useEffect, useState } from "react";
import { getMovieById, type MovieDetail } from "../api/movieApi";
import {
  MovieDetailCard,
  type FriendReview,
} from "../components/MovieDetailCard";

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

const MOCK_FRIEND_REVIEWS: FriendReview[] = [
  {
    id: "1",
    name: "Teddy",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    rating: 6,
    comment: "Overrated but still fun.",
  },
];

export function HomePage() {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRandomList() {
      try {
        setLoading(true);
        setError(null);

        // pick 3–5 random ids from FEATURED_IDS
        const shuffled = [...FEATURED_IDS].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, 4); // show 4 cards

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
      } catch (err) {
        setError("Failed to load featured movies");
      } finally {
        setLoading(false);
      }
    }

    loadRandomList();
  }, []);

  if (loading) return <p>Loading featured movies...</p>;
  if (error) return <p>{error}</p>;
  if (movies.length === 0) return <p>No featured movies available.</p>;

  return (
    <div>
      <h1>Featured movies</h1>
      <p style={{ opacity: 0.8, marginBottom: 12 }}>
        Random picks every time you open the app.
      </p>

      {movies.map((movie) => {
        const parsedImdb =
          movie.imdbRating && movie.imdbRating !== "N/A"
            ? parseFloat(movie.imdbRating)
            : null;

        return (
          <MovieDetailCard
            key={movie.imdbID}
            movie={movie}
            averageRating={parsedImdb}
            friendReviews={MOCK_FRIEND_REVIEWS}
          />
        );
      })}
    </div>
  );
}
