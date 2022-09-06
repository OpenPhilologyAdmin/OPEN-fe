import ReactTooltip from "react-tooltip";

type TooltipProps = {
  isTooltipVisible: boolean;
};

export default function Tooltip({ isTooltipVisible }: TooltipProps) {
  return isTooltipVisible ? <ReactTooltip effect="solid" /> : null;
}
