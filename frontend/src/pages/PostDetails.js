import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/api";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <h3>{post.subtitle}</h3>
      <p>{post.content}</p>
      <p>Author: {post.user?.name}</p>
    </div>
  );
};

export default PostDetails;
