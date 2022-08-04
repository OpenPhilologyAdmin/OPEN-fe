import {
  errorField,
  errorGeneric,
  updateWitnessByIdHandlerDefaultFieldException,
  updateWitnessByIdHandlerGenericException,
  witness,
} from "@/mocks/handlers/witness-list";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import SetDefaultWitnessRadio, { SetDefaultWitnessRadioProps } from "..";

const projectId = 0;

const name = "Name";

function SetDefaultWitnessRadioWithMockToastProvider(props: SetDefaultWitnessRadioProps) {
  return (
    <>
      <MockToastProvider />
      <SetDefaultWitnessRadio {...props} />
    </>
  );
}

describe("SetDefaultWitnessRadio", () => {
  it("renders correctly and sets witness as default", async () => {
    const user = userEvent.setup();

    render(
      <SetDefaultWitnessRadioWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const radioButton = screen.getByRole("radio");

    await user.click(radioButton);

    expect(await screen.findByText("witness_list.witness_set_default")).toBeInTheDocument();
  });

  it("renders correctly and shows generic backend error", async () => {
    mockServer.use(updateWitnessByIdHandlerGenericException);

    const user = userEvent.setup();

    render(
      <SetDefaultWitnessRadioWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const radioButton = screen.getByRole("radio");

    await user.click(radioButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows field backend error", async () => {
    mockServer.use(updateWitnessByIdHandlerDefaultFieldException);

    const user = userEvent.setup();

    render(
      <SetDefaultWitnessRadioWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const radioButton = screen.getByRole("radio");

    await user.click(radioButton);

    expect(await screen.findByText(errorField)).toBeInTheDocument();
  });
});
