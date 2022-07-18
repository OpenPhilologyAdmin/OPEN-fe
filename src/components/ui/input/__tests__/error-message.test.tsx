import { render, screen } from "@/utils/test-utils";

import ErrorMessage from "../error-message";

describe("Input/ErrorMessage", () => {
  it("renders a ErrorMessage correctly", () => {
    render(<ErrorMessage text="text" />);

    expect(screen.getByRole("alert")).toHaveTextContent(/text/);
  });

  it("renders a ErrorMessage correctly and has an info icon", () => {
    render(<ErrorMessage text="text" />);

    expect(screen.getByRole("graphics-symbol"));
  });
});
