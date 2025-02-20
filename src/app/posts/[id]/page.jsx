"use client";
import Post from "../../components/Post";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const Page = ({ params }) => {
  const queryClient = new QueryClient();
  return (
    <section>
      <h1>Post</h1>
      <QueryClientProvider client={queryClient}>
        <Post id={params.id}/>
      </QueryClientProvider>
    </section>
  )
}

export default Page;
