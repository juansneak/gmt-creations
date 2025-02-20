import { usePostsQuery, useCreatePostMutation } from "../queries/posts";
import { useState } from "react";
import { useLayoutContext } from "../contexts/LayoutContext";
import List from "./common/List";
import Modal from "./common/Modal";

const Posts = () => {
  
  const { data: posts, isLoading: isLoadingPosts, error: errorLoadingPosts } = usePostsQuery();
  const { mutate, isPending: isLoadingMutation } = useCreatePostMutation();
  const { showFlashMessage } = useLayoutContext();
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  
  if (isLoadingPosts) return <div>Loading Posts...</div>;
  if (errorLoadingPosts) return <div>There was an error loading the posts</div>;
  
  return (
    <div>
      <button
        type="button"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => setShowPostModal(true)}
      >
        New Post
      </button>
      <List items={posts} model="posts"/>
  
      {showPostModal && (
        <Modal onClose={() => setShowPostModal(false)} title="New Post">
          <input
            type="text"
            placeholder="Enter title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={newPostTitle}
            onChange={(event) => setNewPostTitle(event.target.value)}
          />
          <button
            type="button"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            disabled={isLoadingMutation || !newPostTitle}
            onClick={() =>
              mutate({ title: newPostTitle }, {
                onSuccess: () => {
                  setNewPostTitle("");
                  setShowPostModal(false);
                  showFlashMessage({ type: 'success', text: 'Post saved successfully!' });
                },
                onError: (error) => {
                  showFlashMessage({ type: 'error', text: 'Post saved successfully!' });
                  console.error("Error creating post:", error);
                }
              })
            }
          >
            Accept
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Posts;
