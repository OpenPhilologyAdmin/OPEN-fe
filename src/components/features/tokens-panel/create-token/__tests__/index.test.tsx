import {
  editTokensForProjectByProjectIdException,
  editTokensForProjectByProjectIdProjectFieldException,
  editTokensForProjectByProjectIdSelectedTokenIdsFieldException,
  errorGeneric,
  errorProject,
  errorSelectedTokenIds,
  message,
  token,
} from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import CreateToken, { CreateTokenProps } from "..";

const projectId = 1;

function CreateTokenWithCommonPropsAndToastProvider(props: Partial<CreateTokenProps>) {
  return (
    <>
      <MockToastProvider />
      <CreateToken
        projectId={projectId}
        handleReset={async () => {}}
        selectedTokensForCreation={[token]}
        invalidateProjectViewQueriesCallback={async () => {}}
        toggleSelectionAvailability={() => {}}
        {...props}
      />
    </>
  );
}

describe("CreateToken", () => {
  it("renders correctly and shows generic error on create", async () => {
    mockServer.use(editTokensForProjectByProjectIdException);

    const user = userEvent.setup();

    render(<CreateTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.save_token"));

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows project field error on create", async () => {
    mockServer.use(editTokensForProjectByProjectIdProjectFieldException);

    const user = userEvent.setup();

    render(<CreateTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.save_token"));

    expect(await screen.findByText(errorProject)).toBeInTheDocument();
  });

  it("renders correctly and shows selected_token_ids field error on create", async () => {
    mockServer.use(editTokensForProjectByProjectIdSelectedTokenIdsFieldException);

    const user = userEvent.setup();

    render(<CreateTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.save_token"));

    expect(await screen.findByText(errorSelectedTokenIds)).toBeInTheDocument();
  });

  it("renders correctly and shows success message on create", async () => {
    const user = userEvent.setup();

    render(<CreateTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.save_token"));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });
});
