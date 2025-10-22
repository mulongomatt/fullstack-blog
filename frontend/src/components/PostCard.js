import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}...</p>
      <Link to={`/posts/${post._id}`}>Read more</Link>
    </div>
  );
};

export default PostCard;
