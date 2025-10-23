import React from "react";

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar">
      <div>Dev Blog</div>
      <div>
        {token ? (
          <>
            <a href="/create">Create Post</a>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
