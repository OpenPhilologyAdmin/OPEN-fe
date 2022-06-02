import type { ReactElement, ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

import { GlobalStyle } from "@/constants/global-style";
import BaseLayout from "@/layouts/index";
import { queryClient } from "@/services/api";
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
        <GlobalStyle />
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// HOC usage exception due to library limitation
export default appWithTranslation(MyApp);
