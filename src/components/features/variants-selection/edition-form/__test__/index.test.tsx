import {
  errorGeneric,
  errorVariantsField,
  updateVariantsForTokenByIdGenericException,
  updateVariantsForTokenByIdVariantsFieldException,
  variants,
} from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import EditionForm, { EditionFormProps } from "..";

const projectId = 1;
const tokenId = 1;

function EditionFormWithCommonPropsAndToastProvider(props: Partial<EditionFormProps>) {
  return (
    <>
      <MockToastProvider />
      <EditionForm
        projectId={projectId}
        tokenId={tokenId}
        variants={variants}
        onCancel={() => {}}
        {...props}
      />
    </>
  );
}

describe("EditionForm", () => {
  it("renders correctly and shows generic error", async () => {
    mockServer.use(updateVariantsForTokenByIdGenericException);

    const user = userEvent.setup();

    render(<EditionFormWithCommonPropsAndToastProvider />);

    const textarea = screen.getByLabelText(variants[0].witness);
    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.type(textarea, "test");
    await user.click(saveButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows variants field error", async () => {
    mockServer.use(updateVariantsForTokenByIdVariantsFieldException);

    const user = userEvent.setup();

    render(<EditionFormWithCommonPropsAndToastProvider />);

    const textarea = screen.getByLabelText(variants[0].witness);
    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.type(textarea, "test");
    await user.click(saveButton);

    expect(await screen.findByText(errorVariantsField)).toBeInTheDocument();
  });

  it("renders correctly fires onCancel callback", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<EditionFormWithCommonPropsAndToastProvider onCancel={onCancel} />);

    const textarea = screen.getByLabelText(variants[0].witness);

    const cancelButton = screen.getByRole("button", { name: "project.cancel" });

    await user.type(textarea, "test");
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders correctly and submits the form", async () => {
    const user = userEvent.setup();

    render(<EditionFormWithCommonPropsAndToastProvider />);

    const textarea = screen.getByLabelText(variants[0].witness);

    const saveButton = screen.getByRole("button", { name: "project.save" });

    await user.type(textarea, "test");
    await user.click(saveButton);

    expect(await screen.findByText("project.edit_token_variant_submit")).toBeInTheDocument();
  });
});
