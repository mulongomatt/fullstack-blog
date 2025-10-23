import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import { registerUser, loginUser } from "./api";

function App() {
  const [token, setToken] = useState("");

  // Auto-register & login demo user on app load
  useEffect(() => {
    const authDemoUser = async () => {
      try {
        await registerUser("Demo User", "demo@example.com", "123456");
      } catch (err) {
        // user might already exist, ignore
      }
      const loginRes = await loginUser("demo@example.com", "123456");
      setToken(loginRes.token);
    };
    authDemoUser();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home token={token} />} // pass token to Home if needed
        />
        <Route
          path="/posts/:id"
          element={<PostDetails token={token} />} // pass token to PostDetails if needed
        />
        <Route
          path="/create"
          element={<CreatePost token={token} />} // pass token to CreatePost
        />
      </Routes>
    </Router>
  );
}

export default App;
