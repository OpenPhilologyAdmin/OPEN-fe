import { getEditorialRemarksException } from "@/mocks/handlers/project";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import AddEditorialRemark from "..";

const editorialRemark: API.EditorialRemark = {
  t: "asd",
  type: "conj.",
};

describe("AddEditorialRemark", () => {
  it("renders correctly and shows generic error", async () => {
    mockServer.use(getEditorialRemarksException);

    render(
      <AddEditorialRemark
        initialEditorialRemark={editorialRemark}
        showEditorialRemark={true}
        toggleEditorialRemarkVisibility={() => {}}
        onEditorialRemarkSelect={() => {}}
      />,
    );

    expect(await screen.findByText("project.editorial_remark_error")).toBeInTheDocument();
  });

  it("renders correctly as button", async () => {
    render(
      <AddEditorialRemark
        showEditorialRemark={false}
        toggleEditorialRemarkVisibility={() => {}}
        onEditorialRemarkSelect={() => {}}
      />,
    );

    expect(await screen.findByText("project.add_editorial_remark")).toBeInTheDocument();
  });

  it("renders correctly as form", async () => {
    render(
      <AddEditorialRemark
        showEditorialRemark
        toggleEditorialRemarkVisibility={() => {}}
        onEditorialRemarkSelect={() => {}}
      />,
    );

    expect(await screen.findByText("project.editorial_remark_title")).toBeInTheDocument();
    expect(await screen.findByText("project.editorial_remark_type")).toBeInTheDocument();
    expect(await screen.findByText("project.editorial_remark_content")).toBeInTheDocument();
  });

  it("renders correctly as form and sends correct data to callback", async () => {
    const inputText = "emendation 1";
    const user = userEvent.setup();
    const handler = jest.fn();

    render(
      <AddEditorialRemark
        showEditorialRemark
        toggleEditorialRemarkVisibility={() => {}}
        onEditorialRemarkSelect={handler}
      />,
    );

    const dropDown = await screen.findByLabelText("project.editorial_remark_type");
    const textArea = await screen.findByLabelText("project.editorial_remark_content");

    await user.click(dropDown);

    const option = await screen.findByText("Emendation");

    await user.click(option);

    await user.type(textArea, inputText);

    expect(handler).toHaveBeenCalledWith({ type: "em.", t: inputText });
  });
});
