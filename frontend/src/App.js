import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/login";
import Register from "./pages/register";
import Welcome from "./pages/welcome";
import EditPost from "./pages/EditPost";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/edit/:id" element={<EditPost token={token} />} />
        <Route
          path="/posts"
          element={token ? <Home token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts/:id"
          element={token ? <PostDetails token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={token ? <CreatePost token={token} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
