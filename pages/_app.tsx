import { QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";

import { queryClient } from "@/services/api";
import { ThemeProvider } from "src/contexts/theme";

// exception for NextComponent prop
// eslint-disable-next-line @typescript-eslint/naming-convention
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider initialTheme="LIGHT">
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// HOC usage exception due to library limitation
export default appWithTranslation(MyApp);
