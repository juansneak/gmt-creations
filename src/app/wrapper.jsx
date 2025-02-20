import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function Wrapper() {
  const queryClient = useQueryClient()

  return (
    <section>
      <QueryClientProvider client={queryClient}>
        This is the home page!
      </QueryClientProvider>
    </section>
  );
}
