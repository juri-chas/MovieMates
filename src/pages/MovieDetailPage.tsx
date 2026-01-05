import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById, type MovieDetail } from "../api/movieApi";

type FriendReview = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  comment: string;
};

const MOCK_FRIEND_REVIEWS: FriendReview[] = [
  {
    id: "1",
    name: "Teddy",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    rating: 7,
    comment: "Actually pretty fun. Would watch again.",
  },
  {
    id: "2",
    name: "Maya",
    avatarUrl: "https://i.pravatar.cc/100?img=32",
    rating: 8,
    comment: "Good pacing and solid story.",
  },
];

export function MovieDetailPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieById(id);
        setMovie(data);
      } catch {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  const imdbLabel =
    movie?.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "—";

  const avgFriend = useMemo(() => {
    if (MOCK_FRIEND_REVIEWS.length === 0) return null;
    const sum = MOCK_FRIEND_REVIEWS.reduce((a, r) => a + r.rating, 0);
    return sum / MOCK_FRIEND_REVIEWS.length;
  }, []);

  if (loading) return <p className="muted">Loading movie...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="muted">No movie found.</p>;

  return (
    <div className="movie-card">
      <div className="movie-card__content">
        <div className="movie-card__poster">
          {movie.Poster !== "N/A" ? (
            <img src={movie.Poster} alt={movie.Title} />
          ) : (
            <div className="movie-card__poster-placeholder">No poster</div>
          )}
        </div>

        <div className="movie-card__info">
          <h1 className="movie-card__title">
            {movie.Title} ({movie.Year})
          </h1>

          <div className="movie-card__meta">
            <span>{movie.Genre}</span> · <span>{movie.Runtime}</span>
            {movie.Rated && movie.Rated !== "N/A" ? (
              <>
                {" "}
                · <span>{movie.Rated}</span>
              </>
            ) : null}
          </div>

          <p className="movie-card__plot">{movie.Plot}</p>

          {/* Ratings */}
          <section className="movie-card__ratings">
            <div className="movie-card__rating-main">
              <span className="movie-card__rating-main-value">{imdbLabel}</span>
              <span className="movie-card__rating-main-label">IMDb</span>

              {avgFriend != null && (
                <span className="movie-card__rating-main-label">
                  · Friends {avgFriend.toFixed(1)}
                </span>
              )}
            </div>

            <div className="movie-card__rating-sources">
              {movie.Ratings?.map((r) => (
                <span key={r.Source} className="movie-card__rating-chip">
                  <strong>{r.Value}</strong> {r.Source}
                </span>
              ))}
            </div>
          </section>

          {/* Friends */}
          <section className="movie-card__friends">
            <h2>Friends Reviews</h2>

            {MOCK_FRIEND_REVIEWS.length === 0 && (
              <p className="muted">No friend reviews yet.</p>
            )}

            {MOCK_FRIEND_REVIEWS.map((fr) => (
              <div key={fr.id} className="friend-review">
                <img
                  src={fr.avatarUrl}
                  alt={fr.name}
                  className="friend-review__avatar"
                />

                <div style={{ flex: 1 }}>
                  <div className="friend-review__header">
                    <span>{fr.name}</span>
                    <span className="friend-review__rating">{fr.rating}/10</span>
                  </div>
                  <p className="friend-review__comment">“{fr.comment}”</p>
                </div>
              </div>
            ))}
          </section>

          <div className="movie-card__average">
            Social rating:{" "}
            {avgFriend != null ? `${avgFriend.toFixed(1)}/10` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
