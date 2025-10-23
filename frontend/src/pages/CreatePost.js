import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/api";
import "./CreatePost.css"; // import the CSS

function CreatePost({ token }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await createPost(formData, token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-heading">Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="create-post-input"
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="create-post-input"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-textarea"
        />
        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="upload-label">
            {preview ? (
              <img src={preview} alt="preview" className="preview-image" />
            ) : (
              "Click or drag image here to upload"
            )}
          </label>
        </div>
        <button type="submit" className="create-post-button">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
