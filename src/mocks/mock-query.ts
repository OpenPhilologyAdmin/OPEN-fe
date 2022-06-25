import { QueryCache, QueryClient } from "react-query";

export const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});
export const mockQueryCache = new QueryCache();
