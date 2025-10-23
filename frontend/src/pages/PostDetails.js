import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../api/api";

const PostDetails = ({ token }) => {
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

  if (!post) return <p>Loading...</p>;

  const handleDelete = async () => {
    await deletePost(id, token);
    navigate("/");
  };

  return (
    <div className="container">
      <h2 className="page-title">{post.title}</h2>
      <small>Author: {post.user?.name || "Unknown"}</small>
      <p>{post.content}</p>
      <div className="post-actions">
        <button className="btn delete" onClick={handleDelete}>Delete</button>
        <button className="btn view" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PostDetails;
