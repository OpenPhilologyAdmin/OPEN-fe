import { ReactNode } from "react";
import ModalMock from "react-modal";
import { QueryClientProvider } from "react-query";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import { ToastProvider } from "@/components/ui/toast";
import { UserProvider } from "@/contexts/user";
import { mswServer } from "@/mocks/index";
import { mockQueryCache, mockQueryClient } from "@/mocks/mock-query";
import { mockRouter } from "@/mocks/mock-router";
import { mockUser } from "@/mocks/mock-user";
import * as testing from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "src/contexts/theme";

beforeAll(() => {
  mockQueryCache.clear();
  mswServer.listen({
    onUnhandledRequest: "error",
  });
});

afterEach(() => {
  mswServer.resetHandlers();
  mockQueryCache.clear();
});

afterAll(() => mswServer.close());

function MockProvider({ children, user }: { children: ReactNode; user?: API.User }) {
  return (
    <ThemeProvider initialTheme="LIGHT">
      <UserProvider initialUser={user}>
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

/**
 * Include this provider in tests that rely on react-tostify toast component
 *
 * This is not mocked globally because the way the library is written, it would disrupt all existing snapshots by injecting the provider
 */
export function MockToastProvider() {
  return <ToastProvider />;
}

type DefaultParams = Parameters<typeof testing.render>;
type RenderUI = DefaultParams[0];
type RenderOptions = Omit<DefaultParams[1], "queries"> & {
  router?: Partial<NextRouter>;
  user?: Partial<API.User>;
};

/**
 * Custom render function that wraps the default render from @testing-library/react
 *
 * This function is used to wrap components rendered in tests with mandatory providers used in the app
 *
 * @param ui The rendered component
 * @param options Default render options extended by mocked NextRouter
 * @example render(<Component />, { router: { query: { token: 123 } } })
 */
const customRender = (ui: RenderUI, options?: RenderOptions) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MockProvider user={{ ...mockUser, ...options?.user }}>
      {options?.router ? (
        <RouterContext.Provider value={{ ...mockRouter, ...options.router }}>
          {children}
        </RouterContext.Provider>
      ) : (
        children
      )}
    </MockProvider>
  );

  return testing.render(ui, { wrapper, ...options });
};

// Mock external modal library
const oldFn = ModalMock.setAppElement;

ModalMock.setAppElement = element => {
  if (element === "#__next") {
    // otherwise it will throw aria warnings.
    return oldFn(document.createElement("div"));
  }

  oldFn(element);
};

// ! We want to export all from testing library and override custom render on purpose
// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render, mswServer as mockServer, userEvent };
