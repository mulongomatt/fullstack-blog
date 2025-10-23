import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost, uploadImage } from "../api/api";
import "./EditPost.css";

function EditPost({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id, token);
      setTitle(data.title);
      setSubtitle(data.subtitle);
      setContent(data.content);
      setImage(data.image || "");
    };
    fetchPost();
  }, [id, token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setImage(url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required");

    const res = await updatePost(id, title, subtitle, content, image, token);
    if (res._id) {
      navigate(`/posts/${id}`);
    } else {
      alert(res.msg || "Error updating post");
    }
  };

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form className="edit-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="image-upload">
          <input type="file" onChange={handleFileChange} />
          {uploading && <p>Uploading image...</p>}
          {image && <img src={image} alt="Preview" className="preview-image" />}
        </div>
        <button className="btn" type="submit" disabled={uploading}>
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
