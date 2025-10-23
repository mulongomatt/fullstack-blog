import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../api/api";

const PostDetails = ({ token, userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id, token);
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id, token);
        navigate("/"); // redirect to all posts after deletion
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!post) return <div className="container">Post not found</div>;

  const isAuthor = token && post.user && post.user._id === userId;

  return (
    <div className="container post-details">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-author">
        By: <strong>{post.user?.name || "Unknown"}</strong> |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        {isAuthor && (
          <>
            <Link to={`/edit/${post._id}`} className="btn edit">
              Edit
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
        <button className="btn back" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
