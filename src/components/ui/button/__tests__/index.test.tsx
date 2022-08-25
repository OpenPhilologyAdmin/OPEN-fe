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

  it("renders a tertiary button unchanged", () => {
    const { container } = render(<Button variant="tertiary" />);

    expect(container).toMatchSnapshot();
  });

  it("renders a primary icon button unchanged", () => {
    const { container } = render(
      <Button variant="primary" mode="icon">
        <svg></svg>
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders a secondary icon button unchanged", () => {
    const { container } = render(
      <Button variant="secondary" mode="icon">
        <svg></svg>
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders a tertiary icon button unchanged", () => {
    const { container } = render(
      <Button variant="tertiary" mode="icon">
        <svg></svg>
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders a destruct icon button unchanged", () => {
    const { container } = render(
      <Button variant="primary" destruct mode="icon">
        <svg></svg>
      </Button>,
    );

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

  it("renders a button with loading prop correctly", () => {
    const { container } = render(<Button variant="primary" isLoading />);

    expect(container).toMatchSnapshot();
  });

  it("renders a button with loading and disabled prop correctly", () => {
    const { container } = render(<Button variant="primary" isLoading disabled />);

    expect(container).toMatchSnapshot();
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
