import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/welcome");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/welcome" className="nav-logo">
          DevBlog
        </Link>

        {token && (
          <>
            <Link to="/posts" className="nav-link">
              All Posts
            </Link>
            <Link to="/create" className="nav-link">
              Create Post
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        ) : (
          <button className="nav-link btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
