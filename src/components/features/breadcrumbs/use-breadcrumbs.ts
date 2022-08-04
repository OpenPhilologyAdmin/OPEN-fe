import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { capitalize } from "@/utils/capitalize";

export type Breadcrumb = { href: string; label: string };

/** Generates breadcrumbs based on URL path */
export function useBreadcrumbs() {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>();

  useEffect(() => {
    const pathWithoutQuery = router.asPath.split("?")[0];
    const pathArray = pathWithoutQuery.split("/").filter(path => path !== "");

    const breadcrumbs = pathArray.map((path, index) => {
      const href = "/" + pathArray.slice(0, index + 1).join("/");

      return {
        href,
        label: capitalize(path.split("-").join(" ")),
      };
    });

    setBreadcrumbs(breadcrumbs);
  }, [router.asPath]);

  return {
    breadcrumbs,
  };
}
