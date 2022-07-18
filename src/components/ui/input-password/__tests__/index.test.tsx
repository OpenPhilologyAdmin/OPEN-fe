import { render, screen, userEvent, waitFor } from "@/utils/test-utils";

import InputPassword from "..";

const label = "Label";
const id = "id";

describe("InputPassword", () => {
  it("renders correctly and toggles visibility", async () => {
    const user = userEvent.setup();
    let visibilityToggle;

    render(<InputPassword label={label} id={id} />);

    visibilityToggle = screen.getByRole("button", { name: "a11y.show_password" });

    const input = screen.getByLabelText(label);

    expect(input.getAttribute("type")).toEqual("password");

    await user.click(visibilityToggle);

    waitFor(() => expect(input.getAttribute("type")).toEqual("text"));

    visibilityToggle = screen.getByRole("button", { name: "a11y.hide_password" });

    await user.click(visibilityToggle);

    waitFor(() => expect(input.getAttribute("type")).toEqual("password"));
  });
});
