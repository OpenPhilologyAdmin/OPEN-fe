import {
  errorGeneric,
  errorNewVariants,
  errorProject,
  errorToken,
  message,
  splitTokenForProjectByTokenIdException,
  splitTokenForProjectByTokenIdNewVariantsFieldException,
  splitTokenForProjectByTokenIdProjectFieldException,
  splitTokenForProjectByTokenIdTokenFieldException,
} from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import SplitToken, { SplitTokenProps } from "..";

const projectId = 1;
const tokenId = 1;

function SplitTokenWithCommonPropsAndToastProvider(props: Partial<SplitTokenProps>) {
  return (
    <>
      <MockToastProvider />
      <SplitToken
        projectId={projectId}
        tokenId={tokenId}
        invalidateProjectViewQueriesCallback={async () => {}}
        onCancel={async () => {}}
        {...props}
      />
    </>
  );
}

describe("SplitToken", () => {
  it("renders correctly and shows generic error on split", async () => {
    mockServer.use(splitTokenForProjectByTokenIdException);

    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows project field error on split", async () => {
    mockServer.use(splitTokenForProjectByTokenIdProjectFieldException);

    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(errorProject)).toBeInTheDocument();
  });

  it("renders correctly and shows new_variant field error on split", async () => {
    mockServer.use(splitTokenForProjectByTokenIdNewVariantsFieldException);

    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(errorNewVariants)).toBeInTheDocument();
  });

  it("renders correctly and shows token field error on split", async () => {
    mockServer.use(splitTokenForProjectByTokenIdTokenFieldException);

    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(errorToken)).toBeInTheDocument();
  });

  it("renders correctly and shows success message on split", async () => {
    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("renders correctly and works multiple times when you reset the split flow", async () => {
    const user = userEvent.setup();

    render(<SplitTokenWithCommonPropsAndToastProvider />);

    await user.click(await screen.findByText("project.insert_split_mark"));

    // initiate save
    await user.click(await screen.findByText("project.save_token"));

    // exit the modal
    const [, exitModalButton] = await screen.findAllByText("project.cancel");

    await user.click(exitModalButton);

    // initiate save again
    await user.click(await screen.findByText("project.save_token"));

    // confirm in modal
    await user.click(await screen.findByText("project.continue"));

    expect(await screen.findByText(message)).toBeInTheDocument();
  });
});
