import { render, screen, userEvent } from "@/utils/test-utils";

import InputFile from "..";

const label = "Label";
const id = "id";
const fileName = "file name";

describe("InputFile", () => {
  it("renders correctly and has correct attributes", () => {
    render(<InputFile label={label} id={id} fileDisplayName={fileName} />);

    const input = screen.getByLabelText(label);

    expect(input.getAttribute("type")).toEqual("file");
  });

  it("renders correctly and has file upload icon", () => {
    render(<InputFile label={label} id={id} fileDisplayName={fileName} />);

    const emailIcon = screen.getByRole("graphics-symbol");

    screen.getByText(fileName);

    expect(emailIcon).toBeInTheDocument();
  });

  it("render correctly and supports file upload", async () => {
    const user = userEvent.setup();
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    render(<InputFile label={label} id={id} fileDisplayName={fileName} />);

    const input = screen.getByLabelText(label) as HTMLInputElement;

    await user.upload(input, file);

    const filesInInput = input.files ? input.files : [];

    expect(filesInInput[0]).toStrictEqual(file);
    expect(filesInInput).toHaveLength(1);
  });
});
