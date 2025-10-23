import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../api/api";
import "./PostDetails.css";

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
        navigate("/posts"); // redirect to all posts
      } else {
        alert(res.msg || "Error deleting post");
      }
    }
  };

  if (!post) return <p>Loading...</p>;

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
        <button className="btn btn-edit" onClick={() => navigate(`/edit/${id}`)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          Delete
        </button>
        <button className="btn btn-back" onClick={() => navigate("/posts")}>
          Back
        </button>
      </div>
    </div>
  );
}

export default PostDetails;
