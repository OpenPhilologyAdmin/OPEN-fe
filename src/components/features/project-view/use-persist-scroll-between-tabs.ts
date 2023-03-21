import { useEffect, useRef } from "react";

import { TabVariant } from "./layout-helpers";

interface Params {
  selectedTab: TabVariant;
}

function usePersistScrollBetweenTabs({ selectedTab }: Params) {
  const tokensTabWrapperRef = useRef<HTMLDivElement>(null);
  const variantsTabWrapperRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const persistScrollPositionForTab = (tab: TabVariant) => {
    if (tab === "tokens" && variantsTabWrapperRef.current) {
      scrollPositionRef.current = variantsTabWrapperRef.current.scrollTop;
    }

    if (tab === "variants" && tokensTabWrapperRef.current) {
      scrollPositionRef.current = tokensTabWrapperRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tokensTabWrapperRef.current && selectedTab === "tokens") {
        tokensTabWrapperRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (variantsTabWrapperRef.current && selectedTab === "variants") {
        variantsTabWrapperRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedTab]);

  return {
    scrollPositionRef,
    tokensTabWrapperRef,
    variantsTabWrapperRef,
    persistScrollPositionForTab,
  };
}

export { usePersistScrollBetweenTabs };
