import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/api";

const CreatePost = ({ token }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost(title, content, token);
    navigate("/");
  };

  return (
    <div className="container">
      <h2 className="page-title">Create Post</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit" className="btn submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
