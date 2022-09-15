export function mergeRefs<GenericElement extends HTMLElement | null = HTMLDivElement>(
  ...refs: (React.MutableRefObject<GenericElement> | React.Ref<GenericElement> | undefined)[]
) {
  return (value: GenericElement) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<GenericElement>).current = value;
      }
    });
  };
}
