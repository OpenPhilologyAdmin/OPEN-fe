import { render, screen, userEvent } from "@/utils/test-utils";

import Radio from "..";

const label = "Label";
const id = "Id";

describe("Radio", () => {
  it("renders a Radio unchanged", () => {
    const { container } = render(<Radio />);

    expect(container).toMatchSnapshot();
  });

  it("renders a Radio disabled", () => {
    render(<Radio disabled />);

    expect(screen.getByRole("radio")).toBeDisabled();
  });

  it("renders a Radio with label", () => {
    render(<Radio label={label} id={id} />);

    const radio = screen.getByLabelText(label);

    expect(radio).toBeInTheDocument();
    expect(radio).not.toBeChecked();
  });

  it("renders a Radio and checks on click", async () => {
    const user = userEvent.setup();

    render(<Radio label={label} id={id} />);

    const radio = screen.getByLabelText(label);

    await user.click(radio);

    expect(radio).toBeChecked();
  });

  it("renders a Radio and checks on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Radio label={label} id={id} />);

    const radio = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(radio).toBeChecked();
  });

  it("renders a Radio and focuses on keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<Radio label={label} id={id} />);

    const radio = screen.getByLabelText(label);

    await user.keyboard("[Tab][Space]");

    expect(document.activeElement).toBe(radio);
  });
});
