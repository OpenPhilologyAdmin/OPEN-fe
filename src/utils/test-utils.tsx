import { ReactElement, ReactNode } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

import { mswServer } from "@/mocks/index";
import * as testing from "@testing-library/react";
import { ThemeProvider } from "src/contexts/theme";

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});
const mockQueryCache = new QueryCache();

beforeAll(() =>
  mswServer.listen({
    onUnhandledRequest: "error",
  }),
);

afterEach(() => {
  mswServer.resetHandlers();
  mockQueryCache.clear();
});

afterAll(() => mswServer.close());

function MockProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider initialTheme="LIGHT">
      <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}

const customRender = (ui: ReactElement<any>, options?: Omit<testing.RenderOptions, "queries">) =>
  testing.render(ui, { wrapper: MockProvider, ...options });

// ! We want to export all from testing library and override custom render on purpose
// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render, mswServer as mockServer };
