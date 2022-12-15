import { ComponentType, Ref, useEffect, useRef, useState } from "react";

import { AllotmentHandle, AllotmentProps, PaneProps } from "allotment/dist/types/src/allotment";

function useAllotment() {
  const isMountedRef = useRef(false);
  const allotmentRef = useRef<AllotmentHandle>({
    resize: (sizes = [0, 0]) => {
      console.warn("Allotment is not mounted yet", sizes);
    },
    reset: () => {},
  });

  const [Allotment, setAllotment] = useState<
    ComponentType<AllotmentProps & { ref?: Ref<AllotmentHandle> }> & {
      Pane: ComponentType<PaneProps>;
    }
  >(
    // set default Allotment and Pane on it with children to avoid error on mount/refresh
    () => {
      function Allotment({ children }: AllotmentProps) {
        return <>{children}</>;
      }
      // eslint-disable-next-line react/display-name
      Allotment.Pane = function ({ children }: PaneProps) {
        return <>{children}</>;
      };

      return Allotment;
    },
  );

  // The library needs to be loaded like this because of lack of SSR support and the way it's exported, see issue:
  // https://github.com/johnwalley/allotment/issues/81
  useEffect(() => {
    isMountedRef.current = true;
    import("allotment")
      .then(mod => {
        if (!isMountedRef.current) {
          return;
        }

        setAllotment(mod.Allotment);
      })
      .catch(err => console.error(err, `could not import allotment ${err.message}`));

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { allotmentRef, Allotment };
}

export default useAllotment;
