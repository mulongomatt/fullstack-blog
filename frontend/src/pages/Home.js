import React, { useState, useEffect } from "react";
import { getPosts } from "../api/api";

const Home = ({ token }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (token) {
      getPosts(token).then(setPosts);
    }
  }, [token]);

  if (!token) return <div className="container"><h2>Please login to view posts</h2></div>;

  return (
    <div className="container">
      <h1>All Posts</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post._id} className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
