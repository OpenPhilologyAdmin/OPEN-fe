import {
  getInsignificantVariantsForProjectByIdException,
  variantValue,
} from "@/mocks/handlers/project";
import { mockServer, render, screen } from "@/utils/test-utils";

import InsignificantVariants from "..";

const projectId = 1;

describe("InsignificantVariants", () => {
  it("renders correctly and shows generic error when significant variants are not fetched", async () => {
    mockServer.use(getInsignificantVariantsForProjectByIdException);

    render(
      <InsignificantVariants
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
      <InsignificantVariants
        isOpen
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
      />,
    );

    expect(await screen.findByText(variantValue.details)).toBeInTheDocument();
  });

  it("renders correctly with apparatus index when visible", async () => {
    render(
      <InsignificantVariants
        isOpen
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
        apparatusIndexVisible
      />,
    );

    expect(await screen.findByText("(1)")).toBeInTheDocument();
  });

  it("renders correctly without apparatus index when hidden", async () => {
    render(
      <InsignificantVariants
        isOpen
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
        apparatusIndexVisible={false}
      />,
    );

    expect(screen.queryByText("(1)")).not.toBeInTheDocument();
  });

  it("renders correctly and does not show variants when closed", () => {
    render(
      <InsignificantVariants
        isOpen={false}
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
      />,
    );

    expect(screen.queryByText(variantValue.details)).not.toBeInTheDocument();
  });
});
