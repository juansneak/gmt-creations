import {
  useQuery,
  useMutation
} from '@tanstack/react-query'

const getPosts = async () => {
  let data = {};
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {});
  data = await response.json();
  return data;
}

const getPost = async (id) => {
  let data = {};
  const response = await fetch (`https://jsonplaceholder.typicode.com/posts/${id}`, {});
  data = await response.json();
  return data;
}

const createPost = async (post) => {
  let data = {};
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  data = await response.json();
  return data;
};

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};

export const usePostQuery = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
  });
};

export const useCreatePostMutation = (post) => {
  return useMutation({
    queryKey: ['mutatePost'],
    mutationFn: (post) => createPost(post),
  })
};
