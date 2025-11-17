import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import './NavBar.css';

export function NavBar() {
    const { loggedIn, logout } = useAuth();

  return (
    <div className="navbar-container">
      {!loggedIn ? (
        <nav>
          <NavLink to="/login">Login</NavLink>
        </nav>
      ) : (
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/songs/new">Add Song</NavLink>
          <NavLink to="http://localhost:5555/command">Command</NavLink>
          <NavLink to="/songs">Songs</NavLink>
          <button type='button' onClick={logout}>Logout</button> 
        </nav>
      )}
    </div>
  );
}