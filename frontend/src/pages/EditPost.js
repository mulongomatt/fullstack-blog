import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../api/api";

function EditPost({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostById(id, token);
      setTitle(post.title);
      setSubtitle(post.subtitle || "");
      setContent(post.content);
      setImage(post.image || "");
    };
    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      title,
      subtitle,
      content,
      image,
    };

    const res = await updatePost(id, updatedPost.title, updatedPost.content, token);

    if (res.msg) {
      alert(res.msg); // show error message
    } else {
      navigate(`/posts/${id}`);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Subtitle:</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Image URL (optional):</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditPost;
