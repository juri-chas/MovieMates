import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieById, type MovieDetail } from "../api/movieApi";

const FEATURED_IDS = [
  "tt0103064",
  "tt0088247",
  "tt0241527",
  "tt0372784",
  "tt0848228",
  "tt0133093",
  "tt0120737",
  "tt0111161",
  "tt0468569",
];

// real shuffle (not sort(Math.random))
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MOCK_FRIEND_REVIEWS = [
  { id: "1", name: "Teddy", avatarUrl: "https://i.pravatar.cc/100?img=5", rating: 6, comment: "Overrated but still fun." },
  { id: "2", name: "Alex", avatarUrl: "https://i.pravatar.cc/100?img=12", rating: 8, comment: "Would watch again." },
  { id: "3", name: "Maya", avatarUrl: "https://i.pravatar.cc/100?img=32", rating: 7, comment: "Solid movie night pick." },
];

export function HomePage() {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeatured() {
      try {
        setLoading(true);
        setError(null);

        // read "recently shown" from sessionStorage
        const lastJson = sessionStorage.getItem("mm_last_ids");
        const lastIds: string[] = lastJson ? JSON.parse(lastJson) : [];

        // avoid showing the same ones again first
        const fresh = FEATURED_IDS.filter((id) => !lastIds.includes(id));
        const pool = fresh.length >= 4 ? fresh : FEATURED_IDS; // fallback if pool too small

        // pick as many as possible without repeats
        const pickedUnique = shuffle(pool);

        // if you want lots of cards but your pool is small, we cycle through
        const wanted = 24;
        const picked: string[] = [];
        while (picked.length < wanted) {
          for (const id of pickedUnique) {
            picked.push(id);
            if (picked.length >= wanted) break;
          }
        }

        // save first chunk as "recently shown" so reload changes more
        sessionStorage.setItem("mm_last_ids", JSON.stringify(pickedUnique.slice(0, 8)));

        const results = await Promise.all(
          picked.map(async (id) => {
            try {
              return await getMovieById(id);
            } catch {
              return null;
            }
          })
        );

        if (!controller.signal.aborted) {
          setMovies(results.filter((m): m is MovieDetail => m !== null));
        }
      } catch {
        if (!controller.signal.aborted) setError("Failed to load featured movies");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadFeatured();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <div className="home-bleed">
        <div className="home-bleed__inner">
          <div className="home__top">
            <div>
              <h1 className="home__title">Featured picks</h1>
              <p className="home__subtitle">
                A social movie feed — what people are watching and saying.
              </p>
            </div>
          </div>
        </div>
        <div className="home-divider" />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading featured movies...</p>}

      <div className="movie-grid">
        {movies.map((m, idx) => {
          const imdb =
            m.imdbRating && m.imdbRating !== "N/A"
              ? parseFloat(m.imdbRating)
              : null;

          const f1 = MOCK_FRIEND_REVIEWS[idx % MOCK_FRIEND_REVIEWS.length];
          const f2 = MOCK_FRIEND_REVIEWS[(idx + 1) % MOCK_FRIEND_REVIEWS.length];

          return (
            <Link
              key={`${m.imdbID}-${idx}`}
              to={`/movie/${m.imdbID}`}
              className="movie-card-list-item home-card"
            >
              {m.Poster !== "N/A" ? (
                <img
                  className="movie-card-list-item__poster"
                  src={m.Poster}
                  alt={m.Title}
                />
              ) : (
                <div className="movie-card-list-item__poster--placeholder">?</div>
              )}

              <div className="movie-card-list-item__info">
                <h3>{m.Title}</h3>
                <p className="movie-card-list-item__meta">
                  {m.Year}
                  {m.Genre && m.Genre !== "N/A" ? ` • ${m.Genre}` : ""}
                </p>

                <div className="home-card__social">
                  <div className="home-card__social-row">
                    <span className="home-card__pill">
                      {imdb != null ? `IMDb ${imdb.toFixed(1)}` : "IMDb —"}
                    </span>

                    <div className="home-card__avatars" title="Friend reviews">
                      <img src={f1.avatarUrl} alt={f1.name} className="home-card__avatar" />
                      <img src={f2.avatarUrl} alt={f2.name} className="home-card__avatar" />
                    </div>
                  </div>

                  <div className="home-card__friendline">
                    <strong>{f1.name}</strong>: “{f1.comment}”
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
