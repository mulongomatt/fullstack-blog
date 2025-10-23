import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../api/api";
import "./PostDetails.css"; // import the CSS

function PostDetails({ token, userId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id, token);
        if (data.msg) setError(data.msg);
        else setPost(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await deletePost(id, token);
        if (res.msg === "Post removed") navigate("/posts");
        else alert(res.msg || "Error deleting post");
      } catch (err) {
        console.error(err);
        alert("Error deleting post");
      }
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;

  return (
    <div className="post-details-container">
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <h1 className="post-title">{post.title}</h1>
      {post.subtitle && <h3 className="post-subtitle">{post.subtitle}</h3>}
      <p className="post-meta">
        By: {post.user?.name || "Unknown"} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        {post.user?._id === userId && (
          <>
            <button className="btn btn-edit" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
            <button className="btn btn-delete" onClick={handleDelete}>Delete</button>
          </>
        )}
        <button className="btn btn-back" onClick={() => navigate("/posts")}>Back</button>
      </div>
    </div>
  );
}

export default PostDetails;
