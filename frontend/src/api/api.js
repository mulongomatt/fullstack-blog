const API_URL = "http://localhost:5000/api";

// Register user
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// Login user
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// Get all posts
export const getPosts = async (token) => {
  const res = await fetch(`${API_URL}/posts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

// Get post by ID
export const getPostById = async (id, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

// Create post with subtitle and optional image
export const createPost = async (title, subtitle, content, token, image = "") => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, subtitle, content, image }),
  });
  return res.json();
};

// Update post
export const updatePost = async (id, title, subtitle, content, token, image = "") => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, subtitle, content, image }),
  });
  return res.json();
};

// Delete post
export const deletePost = async (id, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
