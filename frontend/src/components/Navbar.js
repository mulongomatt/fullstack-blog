import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/">DevBlog</Link>
      </div>
      <div>
        {token ? (
          <>
            <Link to="/create">Create Post</Link>
            <button onClick={handleLogout} className="btn delete">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
