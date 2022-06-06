import { render, renderHook, screen } from "@/utils/test-utils";

import CharacterLimit, { useCharacterLimit } from "../character-limit";

const { current, value, max } = { current: "asd", value: 3, max: 10 };

describe("Input/CharacterLimit", () => {
  it("renders a CharacterLimit correctly", () => {
    render(<CharacterLimit current={value} max={max} />);

    expect(screen.getByText(`${value}/${max}`));
  });

  it("renders a CharacterLimit with hook", () => {
    const { result: characterLimit } = renderHook(() => {
      return useCharacterLimit(current);
    });

    // a bit unfortunate naming coincidence :D
    render(<CharacterLimit current={characterLimit.current.current} max={max} />);

    expect(screen.getByText(`${characterLimit.current.current}/${max}`));
  });
});
