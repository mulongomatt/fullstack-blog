import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/api";
import "./CreatePost.css";

const EditPost = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id, token);
        if (data.msg) {
          setError(data.msg);
        } else {
          setTitle(data.title);
          setSubtitle(data.subtitle || "");
          setContent(data.content);
          setImage(data.image || "");
          setPreview(data.image || "");
        }
      } catch (err) {
        setError("Failed to fetch post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, title, subtitle, content, image, token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</div>;

  return (
    <div className="create-post-container">
      <h2>Edit Post</h2>
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
        <div className="image-upload">
          <label>
            {preview ? (
              <img src={preview} alt="Preview" className="post-image" />
            ) : (
              <span>Click or drag to upload an image</span>
            )}
            <input type="file" onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "ml_default"); // replace with your preset
              try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, { method: "POST", body: formData });
                const data = await res.json();
                setImage(data.secure_url);
                setPreview(data.secure_url);
              } catch (err) {
                console.error("Upload failed:", err);
              }
            }} />
          </label>
        </div>
        <button type="submit" className="btn">Update Post</button>
        <button
          type="button"
          className="btn"
          style={{ marginTop: "0.5rem", backgroundColor: "#ccc", color: "#000" }}
          onClick={() => navigate("/posts")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditPost;
