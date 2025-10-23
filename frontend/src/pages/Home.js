import React, { useEffect, useState } from "react";
import { getPosts } from "../api/api";
import { Link } from "react-router-dom";

const Home = ({ token }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(token);
      setPosts(data);
    };
    fetchPosts();
  }, [token]);

  return (
    <div className="container">
      <h2 className="page-title">All Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div className="post-card" key={post._id}>
            <h3>{post.title}</h3>
            <small>Author: {post.user?.name || "Unknown"}</small>
            <p>{post.content.slice(0, 100)}...</p>
            <div className="post-actions">
              <Link to={`/posts/${post._id}`} className="btn view">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
