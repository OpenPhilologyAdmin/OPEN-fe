import { render, screen } from "@/utils/test-utils";

import Panel, { PanelProps } from "..";

const NODES_TEXTS = {
  HEADER: {
    MAIN: {
      ACTION: "header main action",
      TEXT: "header main text",
    },
    ACTION: "header action",
  },

  CHILDREN: "children",
};

function PanelWithCommonProps(props: PanelProps) {
  return (
    <Panel
      {...props}
      headerSlots={{
        mainNodes: {
          action: <div>{NODES_TEXTS.HEADER.MAIN.ACTION}</div>,
          text: <div>{NODES_TEXTS.HEADER.MAIN.TEXT}</div>,
        },
        actionNode: <div>{NODES_TEXTS.HEADER.ACTION}</div>,
      }}
    >
      {NODES_TEXTS.CHILDREN}
    </Panel>
  );
}

describe("Panel", () => {
  it("renders correctly all nodes when open", () => {
    render(<PanelWithCommonProps isOpen={true} />);

    // children
    expect(screen.getByText(NODES_TEXTS.CHILDREN)).toBeInTheDocument();

    // header
    expect(screen.getByText(NODES_TEXTS.HEADER.MAIN.ACTION)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.HEADER.MAIN.TEXT)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.HEADER.ACTION)).toBeInTheDocument();
  });

  it("renders correctly without action node and children when closed", () => {
    render(<PanelWithCommonProps isOpen={false} />);

    // children
    expect(screen.queryByText(NODES_TEXTS.CHILDREN)).not.toBeInTheDocument();

    // header
    expect(screen.getByText(NODES_TEXTS.HEADER.MAIN.ACTION)).toBeInTheDocument();
    expect(screen.getByText(NODES_TEXTS.HEADER.MAIN.TEXT)).toBeInTheDocument();
    expect(screen.queryByText(NODES_TEXTS.HEADER.ACTION)).not.toBeInTheDocument();
  });
});
