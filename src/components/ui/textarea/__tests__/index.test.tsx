import { render, renderHook, screen, userEvent } from "@/utils/test-utils";

import { useCharacterLimit } from "../../character-limit";
import TextArea from "..";

describe("TextArea", () => {
  it("renders a TextArea unchanged", () => {
    const { container } = render(<TextArea />);

    expect(container).toMatchSnapshot();
  });

  it("renders a TextArea with label", () => {
    const { label, id } = { label: "label", id: "id" };

    render(<TextArea id={id} label={label} />);

    expect(screen.getByLabelText(label));
  });

  it("renders a TextArea with CharacterLimit", () => {
    const { defaultValue, ...textAreaProps } = {
      maxLength: 10,
      defaultValue: "asd",
    };

    const { result: characterLimit } = renderHook(() => {
      return useCharacterLimit(defaultValue);
    });

    render(<TextArea current={characterLimit.current.current} {...textAreaProps} />);

    expect(screen.getByText(`${defaultValue.length}/${textAreaProps.maxLength}`));
  });

  it("renders a TextArea with ErrorLabel", () => {
    const errorMessage = "errorMessage";

    render(<TextArea invalid errorMessage={errorMessage} />);

    expect(screen.getByText(errorMessage));
  });

  it("renders a TextArea without ErrorLabel when valid", () => {
    const errorMessage = "errorMessage";

    render(<TextArea invalid={false} errorMessage={errorMessage} />);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });

  it("renders a TextArea and focuses on keyboard navigation", async () => {
    const { label, id } = { label: "label", id: "id" };
    const user = userEvent.setup();

    render(<TextArea id={id} label={label} />);

    const textArea = screen.getByLabelText(label);

    await user.keyboard("[Tab]");

    expect(document.activeElement).toBe(textArea);
  });

  it("renders a TextArea and focuses on click", async () => {
    const { label, id } = { label: "label", id: "id" };
    const user = userEvent.setup();

    render(<TextArea id={id} label={label} />);

    const textArea = screen.getByLabelText(label);

    await user.click(textArea);

    expect(document.activeElement).toBe(textArea);
  });
});
