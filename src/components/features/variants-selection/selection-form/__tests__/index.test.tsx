import {
  errorGeneric,
  errorGroupedVariantsField,
  updateGroupedVariantsForTokenByIdGenericException,
  updateGroupedVariantsForTokenByIdGroupedVariantsFieldException,
} from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import SelectionForm, { SelectionFormProps } from "..";

const projectId = 1;
const tokenId = 1;
const groupedVariants: API.GroupedVariant[] = [
  {
    id: "ab",
    possible: false,
    selected: false,
    t: "asd",
    witnesses: ["a", "b"],
  },
];

function SelectionFormWithCommonPropsAndToastProvider(props: Partial<SelectionFormProps>) {
  return (
    <>
      <MockToastProvider />
      <SelectionForm
        projectId={projectId}
        tokenId={tokenId}
        groupedVariants={groupedVariants}
        {...props}
      />
    </>
  );
}

describe("SelectionForm", () => {
  it("renders correctly and shows generic error", async () => {
    mockServer.use(updateGroupedVariantsForTokenByIdGenericException);

    const user = userEvent.setup();

    render(<SelectionFormWithCommonPropsAndToastProvider />);

    const noSelectionRadio = screen.getByLabelText("project.no_selection") as HTMLInputElement;
    const firstRadioAfterNoSelection = screen.getAllByTestId("selected")[0] as HTMLInputElement;

    expect(noSelectionRadio.checked).toEqual(true);
    expect(firstRadioAfterNoSelection.checked).toEqual(false);

    await user.click(firstRadioAfterNoSelection);

    expect(noSelectionRadio.checked).toEqual(false);
    expect(firstRadioAfterNoSelection.checked).toEqual(true);

    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.click(saveButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows possible field error", async () => {
    mockServer.use(updateGroupedVariantsForTokenByIdGroupedVariantsFieldException);

    const user = userEvent.setup();

    render(<SelectionFormWithCommonPropsAndToastProvider />);

    const noSelectionRadio = screen.getByLabelText("project.no_selection") as HTMLInputElement;
    const firstRadioAfterNoSelection = screen.getAllByTestId("selected")[0] as HTMLInputElement;

    expect(noSelectionRadio.checked).toEqual(true);
    expect(firstRadioAfterNoSelection.checked).toEqual(false);

    await user.click(firstRadioAfterNoSelection);

    expect(noSelectionRadio.checked).toEqual(false);
    expect(firstRadioAfterNoSelection.checked).toEqual(true);

    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.click(saveButton);

    expect(await screen.findByText(errorGroupedVariantsField)).toBeInTheDocument();
  });

  it("renders correctly and selects possible checkbox automatically after marking radio as selected and disabled the checkbox", async () => {
    const user = userEvent.setup();

    render(<SelectionFormWithCommonPropsAndToastProvider />);

    const noSelectionRadio = screen.getByLabelText("project.no_selection") as HTMLInputElement;
    const firstRadioAfterNoSelection = screen.getAllByTestId("selected")[0] as HTMLInputElement;
    const firstCheckboxAfterNoSelection = screen.getAllByTestId("possible")[0] as HTMLInputElement;

    expect(noSelectionRadio.checked).toEqual(true);
    expect(firstRadioAfterNoSelection.checked).toEqual(false);
    expect(firstCheckboxAfterNoSelection.checked).toEqual(false);
    expect(firstCheckboxAfterNoSelection.disabled).toEqual(false);

    await user.click(firstRadioAfterNoSelection);

    expect(noSelectionRadio.checked).toEqual(false);
    expect(firstRadioAfterNoSelection.checked).toEqual(true);
    expect(firstCheckboxAfterNoSelection.checked).toEqual(true);
    expect(firstCheckboxAfterNoSelection.disabled).toEqual(true);

    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.click(saveButton);
  });

  it("renders correctly and marks save button as disabled when no selection radio is selected and only checkbox is marked as possible", async () => {
    const user = userEvent.setup();

    render(<SelectionFormWithCommonPropsAndToastProvider />);

    const noSelectionRadio = screen.getByLabelText("project.no_selection") as HTMLInputElement;
    const firstRadioAfterNoSelection = screen.getAllByTestId("selected")[0] as HTMLInputElement;
    const firstCheckboxAfterNoSelection = screen.getAllByTestId("possible")[0] as HTMLInputElement;

    expect(noSelectionRadio.checked).toEqual(true);
    expect(firstRadioAfterNoSelection.checked).toEqual(false);
    expect(firstCheckboxAfterNoSelection.checked).toEqual(false);
    expect(firstCheckboxAfterNoSelection.disabled).toEqual(false);

    await user.click(firstCheckboxAfterNoSelection);

    expect(noSelectionRadio.checked).toEqual(true);
    expect(firstRadioAfterNoSelection.checked).toEqual(false);
    expect(firstCheckboxAfterNoSelection.checked).toEqual(true);
    expect(firstCheckboxAfterNoSelection.disabled).toEqual(false);

    const saveButton = screen.getByRole("button", { name: "project.save" }) as HTMLButtonElement;

    expect(saveButton.disabled).toEqual(true);
  });
});
