import { render, screen, userEvent } from "@/utils/test-utils";

import Checkbox from "..";

const label = "Label";
const id = "Id";

describe("Checkbox", () => {
  it("renders a Checkbox unchanged", () => {
    const { container } = render(<Checkbox />);

    expect(container).toMatchSnapshot();
  });

  it("renders a Checkbox disabled", () => {
    render(<Checkbox disabled />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("renders a Checkbox with label", () => {
    render(<Checkbox label={label} id={id} />);

    const checkbox = screen.getByLabelText(label);

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("renders a Checkbox and checks on click", async () => {
    const user = userEvent.setup();

    render(<Checkbox label={label} id={id} />);

    const checkbox = screen.getByLabelText(label);

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("renders a Checkbox and checks on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Checkbox label={label} id={id} />);

    const checkbox = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(checkbox).toBeChecked();
  });

  it("renders a Checkbox and focuses on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Checkbox label={label} id={id} />);

    const checkbox = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(document.activeElement).toBe(checkbox);
  });

  it("renders a Checkbox and focuses on click", async () => {
    const user = userEvent.setup();

    render(<Checkbox label={label} id={id} />);

    const checkbox = screen.getByLabelText(label);

    await user.click(checkbox);

    expect(document.activeElement).toBe(checkbox);
  });
});
