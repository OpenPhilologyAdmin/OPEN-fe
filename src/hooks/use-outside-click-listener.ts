import { RefObject, useEffect } from "react";

function useOutsideClickListener(nodeRef: RefObject<HTMLElement>, callback: () => any): void {
  const clickListener = (event: Event) => {
    if (!nodeRef.current) return;

    const { target } = event;

    if (!(target instanceof Element)) return;

    if (!nodeRef.current.contains(target)) {
      callback();
    }
  };

  useEffect((): (() => void) => {
    document.body.addEventListener("click", clickListener);

    return () => {
      document.body.removeEventListener("click", clickListener);
    };
  });
}

export default useOutsideClickListener;
