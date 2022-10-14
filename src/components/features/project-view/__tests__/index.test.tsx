import { getTokensForProjectByIdException, tokenValue } from "@/mocks/handlers/project";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import ProjectView from "..";

const project: API.Project = {
  id: 1,
  name: "string",
  default_witness: "A",
  witnesses: [
    {
      id: "AS",
      name: "Lorem ipsum",
      siglum: "AS",
      default: false,
    },
  ],
  witnesses_count: 0,
  status: "processing",
  created_by: "John Doe",
  creator_id: 1,
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_by: "John Doe",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  import_errors: {},
};

describe("ProjectView", () => {
  it("renders correctly and shows generic error when tokens are not fetched in read mode", async () => {
    mockServer.use(getTokensForProjectByIdException);

    render(<ProjectView project={project} />, { mode: "READ" });

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly and shows generic error when tokens are not fetched in edit mode", async () => {
    mockServer.use(getTokensForProjectByIdException);

    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly and displays token returned from the backend in read mode", async () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(await screen.findByText(tokenValue)).toBeInTheDocument();
  });

  it("renders correctly and displays token returned from the backend in edit mode", async () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(await screen.findByText(tokenValue)).toBeInTheDocument();
  });

  it("renders correctly and displays significant variants section in read mode", () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(screen.getByText("project.significant_variants")).toBeInTheDocument();
  });

  it("renders correctly and displays significant variants section in edit mode", () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(screen.getByText("project.significant_variants")).toBeInTheDocument();
  });

  it("renders correctly and does not display insignificant variants section in read mode", () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(screen.queryByText("project.insignificant_variants")).not.toBeInTheDocument();
  });

  it("renders correctly and displays insignificant variants section in edit mode", () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(screen.getByText("project.insignificant_variants")).toBeInTheDocument();
  });

  it("renders correctly and does not display variants selection section in read mode", () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(screen.queryByText("project.variants")).not.toBeInTheDocument();
  });

  it("renders correctly and displays variants selection section in edit mode", () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(screen.getByText("project.variants")).toBeInTheDocument();
  });

  it("renders correctly and displays variants selection section in edit mode and toggles variant edition", async () => {
    const user = userEvent.setup();

    render(<ProjectView project={project} />, { mode: "EDIT" });

    const editButton = await screen.findByLabelText("project.edit_toggle");

    await user.click(editButton);

    expect(await screen.findByText("project.add_editorial_remark")).toBeInTheDocument();

    await user.click(editButton);

    expect(await screen.findByText("project.no_selection")).toBeInTheDocument();
  });

  it("renders correctly and toggles apparatus index visibility in EDIT mode", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectView project={project} />, { mode: "EDIT" });

    // significant variants + insignificant variants + token + toggle label
    const apparatusIndices = await screen.findAllByText("(1)");

    expect(apparatusIndices.length).toBe(3);

    const toggle = container.querySelector("#apparatus-index-toggle");

    if (toggle) {
      await user.click(toggle);
    }

    // no apparatus indices when toggle enabled
    expect(screen.queryAllByText("(1)").length).toBe(0);
  });

  it("renders correctly and toggles apparatus index visibility in READ mode", async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectView project={project} />, { mode: "READ" });

    // significant variants + insignificant variants + token + toggle label
    const apparatusIndices = await screen.findAllByText("(1)");

    expect(apparatusIndices.length).toBe(2);

    const toggle = container.querySelector("#apparatus-index-toggle");

    if (toggle) {
      await user.click(toggle);
    }

    // no apparatus indices when toggle enabled
    expect(screen.queryAllByText("(1)").length).toBe(0);
  });

  it("renders correctly and displays tokens tab in edit mode", async () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(await screen.findByText("project.tokens_tab")).toBeInTheDocument();
  });

  it("renders correctly and displays variants tab in edit mode", async () => {
    render(<ProjectView project={project} />, { mode: "EDIT" });

    expect(await screen.findByText("project.variants_tab")).toBeInTheDocument();
  });

  it("renders correctly and does not display tokens tab in read mode", () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(screen.queryByText("project.tokens_tab")).not.toBeInTheDocument();
  });

  it("renders correctly and does not display variants tab in read mode", () => {
    render(<ProjectView project={project} />, { mode: "READ" });

    expect(screen.queryByText("project.variants_tab")).not.toBeInTheDocument();
  });
});
