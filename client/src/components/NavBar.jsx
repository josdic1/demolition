import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function NavBar() {
    const { loggedIn, login, logout } = useAuth();

  return (
    <>
    
      { !loggedIn ? <nav><NavLink to="/login">Login</NavLink></nav> : 
      <nav><NavLink to="/">Home</NavLink>
      <NavLink to="/songs/new">Add Song</NavLink>
      <NavLink to="/command">Command</NavLink>
      <NavLink to="/songs">Songs</NavLink>
      <button type='button' onClick={logout}>Logout</button> 
    </nav> }
    </>
  );
}