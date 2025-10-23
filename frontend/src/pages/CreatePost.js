import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/api";
import "./CreatePost.css";

const CreatePost = ({ token }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ml_default");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dsedmnzya/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const res = await createPost(title, subtitle, content, imageUrl, token);
      if (res.msg) setError(res.msg);
      else navigate("/posts");
    } catch (err) {
      setError("Failed to create post");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div
          className="image-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="post-image" />
          ) : (
            <p>Drag & drop an image here, or click to select</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button type="submit" className="btn">
          Create Post
        </button>
        {error && <p className="login-warning">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
