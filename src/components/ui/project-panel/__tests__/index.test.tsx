import { render, screen } from "@/utils/test-utils";

import ProjectPanel, { ProjectPanelProps } from "..";

const NODES_TEXTS = {
  HEADING: "Heading",
  BUTTON_TEXT: "Button text",
  ERROR_TEXT: "Error text",
  LOADER_TEXT: "Loader text",
  ACTION_BUTTON_TEXT: "Action button text",
  CHILDREN: "Children",
};

function ProjectPanelWithCommonProps(props: Partial<ProjectPanelProps>) {
  return (
    <ProjectPanel
      isError={props.isError || false}
      isRefetching={props.isRefetching || false}
      isFetching={props.isFetching || false}
      isLoading={props.isLoading || false}
      isOpen={props.isOpen || false}
      isRotatedWhenClosed={true}
      heading={NODES_TEXTS.HEADING}
      buttonText={NODES_TEXTS.BUTTON_TEXT}
      errorText={NODES_TEXTS.ERROR_TEXT}
      loaderText={NODES_TEXTS.LOADER_TEXT}
      refetch={() => {}}
      togglePanelVisibility={() => {}}
      actionNode={<div>{NODES_TEXTS.ACTION_BUTTON_TEXT}</div>}
      {...props}
    >
      {NODES_TEXTS.CHILDREN}
    </ProjectPanel>
  );
}

describe("ProjectPanel", () => {
  it("renders correctly all nodes when open", () => {
    render(<ProjectPanelWithCommonProps isOpen />);

    // visible nodes
    expect(screen.getByText(NODES_TEXTS.CHILDREN)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.HEADING)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.ACTION_BUTTON_TEXT)).toBeInTheDocument();

    // hidden nodes
    expect(screen.queryByText(NODES_TEXTS.BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.ERROR_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.LOADER_TEXT)).not.toBeInTheDocument();
  });

  it("renders correctly only heading node when closed", () => {
    render(<ProjectPanelWithCommonProps isOpen={false} />);

    // visible nodes
    expect(screen.getByText(NODES_TEXTS.HEADING)).toBeInTheDocument();

    // hidden nodes
    expect(screen.queryByText(NODES_TEXTS.ACTION_BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.CHILDREN)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.ERROR_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.LOADER_TEXT)).not.toBeInTheDocument();
  });

  it("renders correctly when loading", () => {
    render(<ProjectPanelWithCommonProps isOpen={true} isLoading={true} />);

    // visible nodes
    expect(screen.getByText(NODES_TEXTS.HEADING)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.LOADER_TEXT)).toBeInTheDocument();

    // hidden nodes
    expect(screen.queryByText(NODES_TEXTS.ACTION_BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.CHILDREN)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.ERROR_TEXT)).not.toBeInTheDocument();
  });

  it("renders correctly when error", () => {
    render(<ProjectPanelWithCommonProps isOpen={true} isError={true} />);

    // visible nodes
    expect(screen.getByText(NODES_TEXTS.HEADING)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.ERROR_TEXT)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.ACTION_BUTTON_TEXT)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.BUTTON_TEXT)).toBeInTheDocument();

    // hidden nodes
    expect(screen.queryByText(NODES_TEXTS.LOADER_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.CHILDREN)).not.toBeInTheDocument();
  });

  it("renders correctly when refetching", () => {
    render(<ProjectPanelWithCommonProps isOpen={true} isRefetching={true} />);

    // visible nodes
    expect(screen.getByText(NODES_TEXTS.HEADING)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.LOADER_TEXT)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.ACTION_BUTTON_TEXT)).toBeInTheDocument();
    // behind mask but visible
    expect(screen.getByText(NODES_TEXTS.CHILDREN)).toBeInTheDocument();

    // hidden nodes
    expect(screen.queryByText(NODES_TEXTS.BUTTON_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.ERROR_TEXT)).not.toBeInTheDocument();
  });
});
