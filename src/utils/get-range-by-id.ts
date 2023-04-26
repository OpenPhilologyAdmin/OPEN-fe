export const getRangeById = <ElementType extends { id: number }>(
  elements: ElementType[],
  startElementId: number,
  endElementId: number,
) => {
  const elementIds = elements.map(element => element.id);
  const startElementIndex = elementIds.indexOf(startElementId);
  const endElementIndex = elementIds.indexOf(endElementId);

  // only one element followed by apparatus index was selected
  if (endElementId === Infinity) {
    return [elements[startElementIndex]];
  }

  if (startElementId === Infinity) {
    return [elements[endElementIndex]];
  }

  return startElementIndex < endElementIndex
    ? elements.slice(startElementIndex, endElementIndex + 1)
    : elements.slice(endElementIndex, startElementIndex + 1);
};
