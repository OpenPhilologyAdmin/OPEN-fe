import { exportProjectByIdEndpointHandlerGenericException } from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import ExportButton, { ExportFormProps } from "..";

function ExportButtonWithMockToastProvider(props: Partial<ExportFormProps>) {
  return (
    <>
      <MockToastProvider />
      <ExportButton {...props} projectId={1} projectName={"Elo"} />
    </>
  );
}

describe("ExportButton", () => {
  window.URL.createObjectURL = jest.fn();
  HTMLAnchorElement.prototype.click = jest.fn();

  it("renders correctly and exports a file on submit with success", async () => {
    const user = userEvent.setup();

    render(<ExportButtonWithMockToastProvider disabled={false} />);

    const exportButton = screen.getByRole("button", { name: "project.export_button" });

    await user.click(exportButton);

    const confirmButton = screen.getByRole("button", { name: "project.export_submit" });

    await user.click(confirmButton);

    expect(await screen.findByText("project.export_file_message")).toBeInTheDocument();
  });

  it("renders correctly and returns failure from submit request", async () => {
    const user = userEvent.setup();

    mockServer.use(exportProjectByIdEndpointHandlerGenericException);

    render(<ExportButtonWithMockToastProvider disabled={false} />);

    const addButton = screen.getByRole("button", { name: "project.export_button" });

    await user.click(addButton);

    const confirmButton = screen.getByRole("button", { name: "project.export_submit" });

    await user.click(confirmButton);

    expect(await screen.findByText("project.export_failure")).toBeInTheDocument();
  });

  it("renders correctly and does not export on cancel", async () => {
    const user = userEvent.setup();

    render(<ExportButtonWithMockToastProvider disabled={false} />);

    const exportButton = screen.getByRole("button", { name: "project.export_button" });

    await user.click(exportButton);

    const cancelButton = screen.getByRole("button", { name: "project.cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText("project.cancel")).not.toBeInTheDocument();
  });
});
