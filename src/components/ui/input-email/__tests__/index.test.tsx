import { render, screen } from "@/utils/test-utils";

import InputEmail from "..";

const label = "Label";
const id = "id";

describe("InputEmail", () => {
  it("renders correctly and has correct attributes", () => {
    render(<InputEmail label={label} id={id} />);

    const input = screen.getByLabelText(label);

    expect(input.getAttribute("type")).toEqual("email");
    expect(input.getAttribute("autocomplete")).toEqual("email");
  });

  it("renders correctly and has email icon", () => {
    render(<InputEmail label={label} id={id} />);

    const emailIcon = screen.getByRole("graphics-symbol");

    expect(emailIcon).toBeInTheDocument();
  });
});
