import { render } from "@/utils/test-utils";

import Tooltip from "..";

describe("Tooltip", () => {
  it("renders a Tooltip correctly", () => {
    const { container } = render(<Tooltip isTooltipVisible={true} />);

    expect(container).toBeInTheDocument();
  });
  it("hides a Tooltip correctly", () => {
    const { container } = render(<Tooltip isTooltipVisible={false} />);

    expect(container).toBeInTheDocument();
  });
});
