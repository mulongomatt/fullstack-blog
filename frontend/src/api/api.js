const API_URL = "http://localhost:5000/api";

// -------------------- User Authentication --------------------

// Register a new user
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

// -------------------- Blog Posts --------------------

// Get all posts (public)
export const getPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  return res.json();
};

// Get single post by ID (requires token if your backend is protected)
export const getPostById = async (id, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
};

// Create a new post (requires JWT)
export const createPost = async (title, content, token) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

// Update a post (requires JWT)
export const updatePost = async (id, title, content, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
};

// Delete a post (requires JWT)
export const deletePost = async (id, token) => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
