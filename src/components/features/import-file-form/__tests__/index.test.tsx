import { error, importFileHandlerException } from "@/mocks/handlers/import-file";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import ImportFileForm, { ALLOWED_MIME_TYPES, FIELDS } from "..";

function ImportFileFormWithToastProvider() {
  return (
    <>
      <MockToastProvider />
      <ImportFileForm />
    </>
  );
}

const importFileValidInput = {
  [FIELDS.DOCUMENT_NAME]: "Doc name",
  [FIELDS.WITNESS_NAME]: "witt name",
  [FIELDS.SIGLUM]: "AS",
};

/**
 * Source: OPLU-338
 * Importing the text files is temporarily disabled.
 */
// const validTxtFile = new File(["hello"], "hello.txt", { type: ALLOWED_MIME_TYPES.TXT });
const validJsonFile = new File(['{"hello": "hello"}'], "hello.json", {
  type: ALLOWED_MIME_TYPES.JSON,
});
const invalidFile = new File(["hello"], "hello.png", { type: "image/png" });

describe("ImportFileForm", () => {
  // it("renders correctly and supports txt file upload", async () => {
  //   const user = userEvent.setup();
  //
  //   render(<ImportFileFormWithToastProvider />, { router: { push: jest.fn() } });
  //
  //   const fileInput = screen.getByLabelText("import_file.file_name") as HTMLInputElement;
  //   const documentNameInput = screen.getByLabelText("import_file.document_name");
  //   const submitButton = screen.getByRole("button", { name: "import_file.process_file" });
  //
  //   await user.upload(fileInput, validTxtFile);
  //
  //   // for txt upload expect 2 additional fields to be visible
  //   const witnessNameInput = screen.getByLabelText("import_file.witness_name");
  //   const siglumInput = screen.getByLabelText("import_file.siglum");
  //
  //   await user.type(documentNameInput, importFileValidInput[FIELDS.DOCUMENT_NAME]);
  //   await user.type(witnessNameInput, importFileValidInput[FIELDS.WITNESS_NAME]);
  //   await user.type(siglumInput, importFileValidInput[FIELDS.SIGLUM]);
  //   await user.click(submitButton);
  //
  //   expect(await screen.findByText("import_file.processing_file")).toBeInTheDocument();
  // });

  it("renders correctly and supports json file upload", async () => {
    const user = userEvent.setup();

    render(<ImportFileFormWithToastProvider />, { router: { push: jest.fn() } });

    const fileInput = screen.getByLabelText("import_file.file_name") as HTMLInputElement;
    const documentNameInput = screen.getByLabelText("import_file.document_name");
    const submitButton = screen.getByRole("button", { name: "import_file.process_file" });

    await user.upload(fileInput, validJsonFile);

    // for json upload expect 2 additional fields to be invisible
    const witnessNameInput = screen.queryByLabelText("import_file.witness_name");
    const siglumInput = screen.queryByLabelText("import_file.siglum");

    expect(witnessNameInput).not.toBeInTheDocument();
    expect(siglumInput).not.toBeInTheDocument();

    await user.type(documentNameInput, importFileValidInput[FIELDS.DOCUMENT_NAME]);
    await user.click(submitButton);

    expect(await screen.findByText("import_file.processing_file")).toBeInTheDocument();
  });

  it("renders correctly and displays an error for unsupported file format", async () => {
    const user = userEvent.setup();

    render(<ImportFileFormWithToastProvider />, { router: { push: jest.fn() } });

    const fileInput = screen.getByLabelText("import_file.file_name") as HTMLInputElement;
    const documentNameInput = screen.getByLabelText("import_file.document_name");
    const submitButton = screen.getByRole("button", { name: "import_file.process_file" });

    await user.upload(fileInput, invalidFile);
    await user.type(documentNameInput, importFileValidInput[FIELDS.DOCUMENT_NAME]);
    await user.click(submitButton);

    expect(await screen.findByText("import_file.file_error_select")).toBeInTheDocument();
  });

  it("render correctly and handlers error for unsuccessful import file request", async () => {
    mockServer.use(importFileHandlerException);

    const user = userEvent.setup();

    render(<ImportFileFormWithToastProvider />, { router: { push: jest.fn() } });

    const fileInput = screen.getByLabelText("import_file.file_name") as HTMLInputElement;
    const documentNameInput = screen.getByLabelText("import_file.document_name");
    const submitButton = screen.getByRole("button", { name: "import_file.process_file" });

    await user.upload(fileInput, validJsonFile);
    await user.type(documentNameInput, importFileValidInput[FIELDS.DOCUMENT_NAME]);
    await user.click(submitButton);

    expect(await screen.findByText(error)).toBeInTheDocument();
  });
});
