import { render, screen } from "@/utils/test-utils";

import Button from "..";

const text = "Some text";

describe("Button", () => {
  it("renders a primary button unchanged", () => {
    const { container } = render(<Button variant="primary" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a secondary button unchanged", () => {
    const { container } = render(<Button variant="secondary" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a primary-outline button unchanged", () => {
    const { container } = render(<Button variant="primary-outline" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a secondary-outline button unchanged", () => {
    const { container } = render(<Button variant="secondary-outline" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a primary-ghost button unchanged", () => {
    const { container } = render(<Button variant="primary-ghost" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a secondary-ghost button unchanged", () => {
    const { container } = render(<Button variant="secondary-ghost" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a button with left prop correctly", () => {
    render(<Button variant="primary" left={<div>{text}</div>} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders a button with right prop correctly", () => {
    render(<Button variant="primary" right={<div>{text}</div>} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders a button with disabled prop correctly", () => {
    render(<Button variant="primary" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders a button with small prop correctly", () => {
    const { container } = render(<Button small />);

    expect(container).toMatchSnapshot();
  });

  it("renders a button as link", () => {
    const href = "https://example.com";

    render(
      <Button variant="primary" href={href}>
        {text}
      </Button>,
    );

    expect(screen.getByRole("link", { name: text }).closest("a")).toHaveAttribute("href", href);
  });
});
