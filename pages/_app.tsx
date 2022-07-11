import type { ReactElement, ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

import { ToastProvider } from "@/components/toast";
import { GlobalStyle } from "@/constants/global-style";
import { UserProvider } from "@/contexts/user";
import BaseLayout from "@/layouts/base";
import { queryClient } from "@/services/api/client";
import { ThemeProvider } from "src/contexts/theme";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// exception for Component prop
// eslint-disable-next-line @typescript-eslint/naming-convention
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => <BaseLayout>{page}</BaseLayout>);

  return (
    <ThemeProvider initialTheme="LIGHT">
      <QueryClientProvider client={queryClient}>
        <UserProvider initialUser={pageProps.user}>
          <GlobalStyle />
          <ToastProvider />
          {getLayout(<Component {...pageProps} />)}
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// HOC usage exception due to library limitation
export default appWithTranslation(MyApp);
