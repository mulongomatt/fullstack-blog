import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/api";
import "./CreatePost.css"; // use your existing styling file

const Register = ({ setToken }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser(name, email, password);
      if (res._id) {
        // auto-login after registration
        const loginRes = await loginUser(email, password);
        setToken(loginRes.token);
        localStorage.setItem("token", loginRes.token);
        navigate("/posts"); // redirect to all posts
      } else {
        setError(res.msg || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Register</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          Register
        </button>
        {error && <p className="login-warning">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
