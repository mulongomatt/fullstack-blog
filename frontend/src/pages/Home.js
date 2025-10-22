import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Blog Posts</h1>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
};

export default Home;
