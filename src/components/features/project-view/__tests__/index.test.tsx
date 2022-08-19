import { getGetTokensForProjectByIdException, tokenValue } from "@/mocks/handlers/project";
import { mockServer, render, screen } from "@/utils/test-utils";

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
};

describe("ProjectView", () => {
  it("renders correctly and shows generic error when tokens are not fetched in read mode", async () => {
    mockServer.use(getGetTokensForProjectByIdException);

    render(<ProjectView project={project} />, { mode: "READ" });

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly and shows generic error when tokens are not fetched in edit mode", async () => {
    mockServer.use(getGetTokensForProjectByIdException);

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
});
