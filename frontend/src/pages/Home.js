import React, { useState, useEffect } from "react";
import { getPosts } from "../api";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Posts</h1>
      {posts.map((p) => (
        <div
          key={p._id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <Link to={`/posts/${p._id}`}>
            <h3>{p.title}</h3>
          </Link>
          <p>{p.content}</p>
          <small>Created: {new Date(p.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default Home;
