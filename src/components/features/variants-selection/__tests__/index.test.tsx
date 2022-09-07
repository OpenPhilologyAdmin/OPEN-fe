import {
  getTokenDetailsForProjectByIdGenericException,
  groupedVariants,
} from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen } from "@/utils/test-utils";

import VariantsSelection, { VariantsSelectionProps } from "..";

const projectId = 1;
const tokenId = 1;

function VariantsSelectionWithCommonPropsAndToastProvider(props: Partial<VariantsSelectionProps>) {
  return (
    <>
      <MockToastProvider />
      <VariantsSelection
        tokenId={tokenId}
        projectId={projectId}
        isOpen={props.isOpen || true}
        togglePanelVisibility={() => {}}
        isRotatedWhenClosed
        onGroupedVariantSelectionSubmit={
          props.onGroupedVariantSelectionSubmit
            ? props.onGroupedVariantSelectionSubmit
            : () => Promise.resolve()
        }
      />
    </>
  );
}

describe("VariantsSelection", () => {
  it("renders correctly and shows generic error", async () => {
    mockServer.use(getTokenDetailsForProjectByIdGenericException);

    render(<VariantsSelectionWithCommonPropsAndToastProvider />);

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly the selection form", async () => {
    render(<VariantsSelectionWithCommonPropsAndToastProvider />);

    expect(await screen.findByText("project.no_selection")).toBeInTheDocument();

    const radios = screen.getAllByTestId("selected");
    const checkboxes = screen.getAllByTestId("possible");

    expect(radios.length).toBe(groupedVariants.length);
    expect(checkboxes.length).toBe(groupedVariants.length);
  });
});
