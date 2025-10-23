import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post, token, onDelete }) => {
  const isAuthor = token && post.author && post.author._id === JSON.parse(atob(token.split('.')[1])).user.id;

  return (
    <div style={cardStyle}>
      <h2>{post.title}</h2>
      <p style={{ fontStyle: "italic", color: "#555" }}>by {post.author?.name}</p>
      <p>{post.content.substring(0, 150)}...</p>
      <div>
        <Link to={`/posts/${post._id}`} style={linkBtn}>Read More</Link>
        {isAuthor && (
          <>
            <Link to={`/edit/${post._id}`} style={editBtn}>Edit</Link>
            <button onClick={() => onDelete(post._id)} style={delBtn}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  backgroundColor: "#f9f9f9",
};

const linkBtn = { marginRight: "0.5rem", textDecoration: "none", color: "#0077cc" };
const editBtn = { marginRight: "0.5rem", textDecoration: "none", color: "#ff9900" };
const delBtn = { color: "#ff0000", cursor: "pointer", border: "none", background: "none" };

export default PostCard;
