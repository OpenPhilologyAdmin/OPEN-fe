import {
  getSignificantVariantsForProjectByIdException,
  variantValue,
} from "@/mocks/handlers/project";
import { mockServer, render, screen } from "@/utils/test-utils";

import SignificantVariants from "..";

const projectId = 1;

describe("SignificantVariants", () => {
  it("renders correctly and shows generic error when significant variants are not fetched", async () => {
    mockServer.use(getSignificantVariantsForProjectByIdException);

    render(
      <SignificantVariants
        isOpen={true}
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
      />,
    );

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly variants when open", async () => {
    render(
      <SignificantVariants
        isOpen
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
      />,
    );

    expect(await screen.findByText(variantValue.selected_reading)).toBeInTheDocument();
    expect(await screen.findByText(variantValue.details)).toBeInTheDocument();
  });

  it("renders correctly and does not show variants when closed", () => {
    render(
      <SignificantVariants
        isOpen={false}
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
      />,
    );

    expect(screen.queryByText(variantValue.selected_reading)).not.toBeInTheDocument();
    expect(screen.queryByText(variantValue.details)).not.toBeInTheDocument();
  });
});
