import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function isFullYear(value: string) {
  return /^\d{4}$/.test(value);
}


type Item = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE = "https://www.omdbapi.com/";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">(
    "idle"
  );
  const [error, setError] = useState("");

  // debounce
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!API_KEY) {
      setStatus("error");
      setError("Missing OMDb API key.");
      return;
    }

    if (!debouncedQuery) {
      setStatus("idle");
      setItems([]);
      return;
    }

    const controller = new AbortController();

    async function run() {
      setStatus("loading");
      setError("");

      const url = new URL(BASE);
      url.searchParams.set("apikey", API_KEY);
      url.searchParams.set("s", debouncedQuery);
      if (type) url.searchParams.set("type", type);

      try {
        const res = await fetch(url.toString(), {
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.Response === "False") {
          setItems([]);
          setStatus("empty");
          return;
        }

        setItems(data.Search || []);
        setStatus("idle");
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setStatus("error");
        setError("Search failed.");
      }
    }

    run();
    return () => controller.abort();
  }, [debouncedQuery, type]);

  // year range filter (client-side)
  const filtered = items.filter((m) => {
    const year = parseInt(m.Year, 10);
    if (Number.isNaN(year)) return false;

    if (isFullYear(minYear) && year < Number(minYear)) return false;
    if (isFullYear(maxYear) && year > Number(maxYear)) return false;

    return true;
  });


  return (
    <div>
      <h1>Search</h1>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setDebouncedQuery(query.trim());
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="filters-simple">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>

        <input
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
          placeholder="Min year"
        />

        <input
          value={maxYear}
          onChange={(e) => setMaxYear(e.target.value)}
          placeholder="Max year"
        />
      </div>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p className="error">{error}</p>}
      {status === "empty" && <p className="muted">No results.</p>}

      <div className="movie-grid">
        {filtered.map((m) => (
          <Link
            key={m.imdbID}
            to={`/movie/${m.imdbID}`}
            className="movie-card-list-item"
          >
            {m.Poster !== "N/A" ? (
              <img
                className="movie-card-list-item__poster"
                src={m.Poster}
                alt={m.Title}
              />
            ) : (
              <div className="movie-card-list-item__poster movie-card-list-item__poster--placeholder">
                ?
              </div>
            )}

            <div className="movie-card-list-item__info">
              <h3>{m.Title}</h3>
              <p className="movie-card-list-item__meta">
                {m.Year} • {m.Type}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
