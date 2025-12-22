import type { MovieDetail } from "../api/movieApi";

export type FriendReview = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  comment: string;
};

type MovieDetailCardProps = {
  movie: MovieDetail;
  // optional: if you pass your own “average social rating”
  averageRating?: number | null;
  friendReviews: FriendReview[];
};

export function MovieDetailCard({
  movie,
  averageRating,
  friendReviews,
}: MovieDetailCardProps) {
  const imdbLabel =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? movie.imdbRating
      : "—";

  const avgLabel =
    averageRating != null ? averageRating.toFixed(1) : imdbLabel;

  return (
    <div className="movie-card">
      <div className="movie-card__content">
        <div className="movie-card__poster">
          {movie.Poster !== "N/A" && (
            <img src={movie.Poster} alt={movie.Title} />
          )}
        </div>

        <div className="movie-card__info">
          <h1 className="movie-card__title">{movie.Title}</h1>
          <p className="movie-card__plot">{movie.Plot}</p>

          <div className="movie-card__meta">
            <span>{movie.Year}</span> · <span>{movie.Genre}</span> ·{" "}
            <span>{movie.Runtime}</span>
          </div>

          {/* Global / external ratings */}
          <section className="movie-card__ratings">
            <div className="movie-card__rating-main">
              <span className="movie-card__rating-main-value">
                {imdbLabel}
              </span>
              <span className="movie-card__rating-main-label">IMDb</span>
            </div>

            <div className="movie-card__rating-sources">
              {movie.Ratings?.map((r) => (
                <span key={r.Source} className="movie-card__rating-chip">
                  <strong>{r.Value}</strong>
                  <span>{r.Source}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Friends reviews */}
          <section className="movie-card__friends">
            <h2>Friends Reviews</h2>
            {friendReviews.length === 0 && <p>No friend reviews yet.</p>}

            {friendReviews.map((fr) => (
              <div key={fr.id} className="friend-review">
                <img
                  src={fr.avatarUrl}
                  alt={fr.name}
                  className="friend-review__avatar"
                />
                <div className="friend-review__body">
                  <div className="friend-review__header">
                    <span className="friend-review__name">{fr.name}</span>
                    <span className="friend-review__rating">
                      {fr.rating}/10
                    </span>
                  </div>
                  <p className="friend-review__comment">{fr.comment}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      <div className="movie-card__average">
        <span>{avgLabel}/10</span> Average rating
      </div>
    </div>
  );
}
