import ReactTooltip, { Place } from "react-tooltip";

type TooltipProps = {
  isTooltipVisible: boolean;
  place?: Place;
};

export default function Tooltip({ isTooltipVisible, place }: TooltipProps) {
  return isTooltipVisible ? <ReactTooltip effect="solid" place={place} /> : null;
}
