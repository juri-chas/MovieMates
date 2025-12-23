import { Link, NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          MovieMates
        </Link>
        <nav className="navbar__links">
          <NavLink to="/" end className="navbar__link">
            Home
          </NavLink>
          <NavLink to="/search" className="navbar__link">
            Search
          </NavLink>
          <NavLink to="/profile" className="navbar__link">
            Profile
          </NavLink>
          <NavLink to="/login" className="navbar__link">
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
