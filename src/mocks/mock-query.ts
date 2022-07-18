import { QueryCache, QueryClient, setLogger } from "react-query";

export const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

setLogger({
  log: console.log,
  warn: console.warn,
  // ✅ turns off request errors on the console
  error: () => {},
});

export const mockQueryCache = new QueryCache();
