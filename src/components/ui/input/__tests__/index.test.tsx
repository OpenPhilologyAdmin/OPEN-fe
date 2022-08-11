import { render, renderHook, screen, userEvent } from "@/utils/test-utils";

import Input from "..";
import { useCharacterLimit } from "../character-limit";

describe("Input", () => {
  it("renders an Input unchanged", () => {
    const { container } = render(<Input />);

    expect(container).toMatchSnapshot();
  });

  it("renders an Input with left props", () => {
    const leftText = "node";

    render(<Input left={<div>{leftText}</div>} />);
    expect(screen.getByText(leftText));
  });

  it("renders an Input with right props", () => {
    const rightText = "node";

    render(<Input right={<div>{rightText}</div>} />);
    expect(screen.getByText(rightText));
  });

  it("renders an Input with label", () => {
    const { label, id } = { label: "label", id: "id" };

    render(<Input id={id} label={label} />);

    expect(screen.getByLabelText(label));
  });

  it("renders an Input with CharacterLimit", () => {
    const { defaultValue, ...inputProps } = {
      maxLength: 10,
      defaultValue: "asd",
    };

    const { result: characterLimit } = renderHook(() => {
      return useCharacterLimit(defaultValue);
    });

    render(<Input current={characterLimit.current.current} {...inputProps} />);

    expect(screen.getByText(`${defaultValue.length}/${inputProps.maxLength}`));
  });

  it("renders an Input with ErrorLabel", () => {
    const errorMessage = "errorMessage";

    render(<Input invalid errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage));
  });

  it("renders an Input without ErrorLabel when valid", () => {
    const errorMessage = "errorMessage";

    render(<Input invalid={false} errorMessage={errorMessage} />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("renders an Input and focuses on keyboard navigation", async () => {
    const { label, id } = { label: "label", id: "id" };
    const user = userEvent.setup();

    render(<Input id={id} label={label} />);

    const input = screen.getByLabelText(label);

    await user.keyboard("[Tab]");

    expect(document.activeElement).toBe(input);
  });

  it("renders an Input and focuses on click", async () => {
    const { label, id } = { label: "label", id: "id" };
    const user = userEvent.setup();

    render(<Input id={id} label={label} />);

    const input = screen.getByLabelText(label);

    await user.click(input);

    expect(document.activeElement).toBe(input);
  });
});
