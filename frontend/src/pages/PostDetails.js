import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../api"; // you could create getPostById if needed

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const allPosts = await getPosts();
      const foundPost = allPosts.find((p) => p._id === id);
      setPost(foundPost);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>Created: {new Date(post.createdAt).toLocaleString()}</small>
    </div>
  );
}

export default PostDetails;
