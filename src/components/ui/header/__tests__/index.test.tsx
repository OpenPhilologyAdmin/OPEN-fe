import { render, screen } from "@/utils/test-utils";

import Header from "..";

describe("Header", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("header.editing_environment")).toBeInTheDocument();
  });

  it("renders correctly with children", () => {
    const childMessage = "Hello";

    render(
      <Header>
        <span>{childMessage}</span>
      </Header>,
    );

    expect(screen.getByText(childMessage)).toBeInTheDocument();
  });
});
