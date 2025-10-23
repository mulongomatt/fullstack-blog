import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "./CreatePost.css"; // use your existing styling file

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(email, password);
      if (res.token) {
        setToken(res.token);
        localStorage.setItem("token", res.token);
        navigate("/posts"); // redirect after login
      } else {
        setError(res.msg || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Login</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
        {error && <p className="login-warning">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
