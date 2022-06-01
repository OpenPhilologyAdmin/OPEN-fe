import { render } from "@/utils/test-utils";

import Button from "..";

describe("Button", () => {
  it("renders a button in the default variant", () => {
    render(<Button />);
  });

  it("renders a button unchanged", () => {
    const { container } = render(<Button />);

    expect(container).toMatchSnapshot();
  });
});
