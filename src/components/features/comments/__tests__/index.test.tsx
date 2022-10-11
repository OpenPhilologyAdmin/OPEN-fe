import { commentsValue, getCommentsForProjectByIdException } from "@/mocks/handlers/project";
import { mockServer, render, screen } from "@/utils/test-utils";

import Comments from "..";

const projectId = 1;
const tokenId = 1;

describe("Comments", () => {
  it("renders correctly and shows generic error when comments are not fetched", async () => {
    mockServer.use(getCommentsForProjectByIdException);

    render(
      <Comments
        isOpen={true}
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
        tokenId={tokenId}
      />,
    );

    expect(await screen.findByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly comments when open", async () => {
    render(
      <Comments
        isOpen
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
        tokenId={tokenId}
      />,
    );

    expect(await screen.findByText(commentsValue.body)).toBeInTheDocument();
  });

  it("renders correctly and does not show comments when closed", () => {
    render(
      <Comments
        isOpen={false}
        togglePanelVisibility={() => {}}
        projectId={projectId}
        isRotatedWhenClosed
        tokenId={null}
      />,
    );

    expect(screen.queryByText(commentsValue.body)).not.toBeInTheDocument();
  });
});
