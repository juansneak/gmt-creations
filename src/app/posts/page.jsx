"use client";
import Posts from "../components/Posts";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const Page = () => {
  const queryClient = new QueryClient();
  return (
    <section>
      <QueryClientProvider client={queryClient}>
        <Posts/>
      </QueryClientProvider>
    </section>
  );
}

export default Page;
