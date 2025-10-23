import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../api/api";

function PostDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id, token);
      setPost(data);
    };
    fetchPost();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const res = await deletePost(id, token);
      if (res.msg === "Post removed") {
        navigate("/"); // go back to all posts
      } else {
        alert(res.msg || "Error deleting post");
      }
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {post.image && (
        <div
          style={{
            height: "300px",
            backgroundImage: `url(${post.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#4f46e5" }}>
        {post.title}
      </h1>
      {post.subtitle && (
        <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#6b7280" }}>
          {post.subtitle}
        </h3>
      )}
      <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "20px" }}>
        By: {post.user?.name || "Unknown"} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p style={{ fontSize: "1rem", lineHeight: "1.6", marginBottom: "30px" }}>
        {post.content}
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate(`/edit/${id}`)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#fbbf24",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Delete
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default PostDetails;
