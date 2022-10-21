export const getRangeById = <ElementType extends { id: number }>(
  elements: ElementType[],
  startElementId: number,
  endElementId: number,
) => {
  const elementIds = elements.map(element => element.id);
  const startElementIndex = elementIds.indexOf(startElementId);
  const endElementIndex = elementIds.indexOf(endElementId);
  const selectedElements =
    startElementIndex < endElementIndex
      ? elements.slice(startElementIndex, endElementIndex + 1)
      : elements.slice(endElementIndex, startElementIndex + 1);

  return selectedElements;
};
