import React, { useState } from "react";
import { createPost } from "../api";
import { useNavigate } from "react-router-dom";

function CreatePost({ token }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in!");
    const newPost = await createPost(title, content, token);
    alert("Post created!");
    setTitle("");
    setContent("");
    navigate("/"); // redirect to home
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
