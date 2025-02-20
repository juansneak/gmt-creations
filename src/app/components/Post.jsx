import { usePostQuery } from "../queries/posts";
import ItemDetail from "./common/ItemDetail";

const Post = ({ id }) => {
  const { data: post, isLoading, error } = usePostQuery(id);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>There was an error loading the posts</div>;
  
  return (
    <ItemDetail item={post} />
  );
}

export default Post;
