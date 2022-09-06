import { MouseEvent, useState } from "react";

export const useTooltip = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(true);

  function handleShowToolTip() {
    return setTooltipVisible(true);
  }

  const handleHideTooltip = () => {
    setTooltipVisible(false);
    setTimeout(() => setTooltipVisible(true), 50);
  };

  return {
    handleShowToolTip,
    handleHideTooltip,
    isTooltipVisible,
    setTooltipVisible,
  };
};

export function isEllipsisActive(event: MouseEvent<HTMLSpanElement>) {
  return event.currentTarget.offsetWidth < event.currentTarget.scrollWidth;
}
