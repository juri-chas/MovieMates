import { Link } from "react-router-dom";
import type { MovieSearchItem } from "../api/movieApi";

type MovieCardProps = {
  movie: MovieSearchItem;
  generalRating?: number | null;
  userRating?: number | null;
  friendsRating?: number | null;
  friendsCount?: number | null;
};

export function MovieCard({
  movie,
  generalRating,
  userRating,
  friendsRating,
  friendsCount,
}: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  const generalLabel =
    generalRating != null ? generalRating.toFixed(1) : "—";
  const userLabel = userRating != null ? userRating.toFixed(1) : "—";
  const friendsLabel =
    friendsRating != null ? friendsRating.toFixed(1) : "—";
  const friendsSuffix = friendsCount ? ` (${friendsCount})` : "";

  return (
    <Link to={`/movie/${movie.imdbID}`} className="movie-card-list-item">
      {hasPoster ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="movie-card-list-item__poster"
        />
      ) : (
        <div className="movie-card-list-item__poster movie-card-list-item__poster--placeholder">
          ?
        </div>
      )}

      <div className="movie-card-list-item__info">
        <h3>{movie.Title}</h3>
        <p className="movie-card-list-item__meta">
          {movie.Year} · {movie.Type}
        </p>

        <div className="movie-card-list-item__ratings">
          <div className="movie-card-list-item__rating-pill movie-card-list-item__rating-pill--global">
            <span className="movie-card-list-item__rating-value">
              {generalLabel}
            </span>
            <span className="movie-card-list-item__rating-label">
              Global
            </span>
          </div>
          <div className="movie-card-list-item__rating-pill">
            <span className="movie-card-list-item__rating-value">
              {userLabel}
            </span>
            <span className="movie-card-list-item__rating-label">You</span>
          </div>
          <div className="movie-card-list-item__rating-pill">
            <span className="movie-card-list-item__rating-value">
              {friendsLabel}
            </span>
            <span className="movie-card-list-item__rating-label">
              Friends{friendsSuffix}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
