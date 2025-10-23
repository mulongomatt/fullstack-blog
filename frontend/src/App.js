// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Login from "./pages/login";
import Register from "./pages/register";

/**
 * Helper: decode a JWT without any external library.
 * Returns decoded payload object or null on failure.
 */
function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // base64url -> base64
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decodedJson = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(decodedJson);
  } catch (err) {
    console.warn("Failed to decode token:", err);
    return null;
  }
}

function App() {
  // token string (JWT)
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // user object decoded from token payload (expected shape: { user: { id, name, ... } })
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    const decoded = decodeJwt(t);
    return decoded?.user || null;
  });

  // keep localStorage in sync if token changed elsewhere
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = decodeJwt(token);
      setUser(decoded?.user || null);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // Call this after a successful login (pass token string)
  const handleLogin = (newToken) => {
    setToken(newToken);
    // decoded will be handled by the useEffect above
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {/* pass token and user so children/components can check authorship */}
      <Navbar token={token} setToken={setToken} user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home token={token} user={user} />} />
        <Route path="/posts/:id" element={<PostDetails token={token} userId={user?.id || user?._id} />} />
        <Route path="/create" element={<CreatePost token={token} user={user} />} />
        <Route path="/edit/:id" element={<EditPost token={token} user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} setToken={setToken} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
