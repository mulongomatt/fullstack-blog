import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
      navigate("/");
    } else {
      setError(res.msg || "Login failed");
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
