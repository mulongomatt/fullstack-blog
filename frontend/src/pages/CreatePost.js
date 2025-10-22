import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", { title, content });
      alert("Post created successfully!");
      navigate("/"); // go back to home
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Content:</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            style={{ width: "100%", padding: "0.5rem" }}
          ></textarea>
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
