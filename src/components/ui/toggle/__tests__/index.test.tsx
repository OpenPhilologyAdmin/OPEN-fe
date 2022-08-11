import { render, screen, userEvent } from "@/utils/test-utils";

import Toggle from "..";

const label = "Label";
const id = "Id";

describe("Toggle", () => {
  it("renders a Toggle unchanged", () => {
    const { container } = render(<Toggle />);

    expect(container).toMatchSnapshot();
  });

  it("renders a Toggle disabled", () => {
    render(<Toggle disabled />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("renders a Toggle with label", () => {
    render(<Toggle label={label} id={id} />);

    const toggle = screen.getByLabelText(label);

    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  it("renders a Toggle and checks on click", async () => {
    const user = userEvent.setup();

    render(<Toggle label={label} id={id} />);

    const toggle = screen.getByLabelText(label);

    await user.click(toggle);

    expect(toggle).toBeChecked();
  });

  it("renders a Toggle and checks on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Toggle label={label} id={id} />);

    const toggle = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(toggle).toBeChecked();
  });

  it("renders a Toggle and focuses on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Toggle label={label} id={id} />);

    const toggle = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(document.activeElement).toBe(toggle);
  });

  it("renders a Toggle and focuses on click", async () => {
    const user = userEvent.setup();

    render(<Toggle label={label} id={id} />);

    const toggle = screen.getByLabelText(label);

    await user.click(toggle);

    expect(document.activeElement).toBe(toggle);
  });
});
