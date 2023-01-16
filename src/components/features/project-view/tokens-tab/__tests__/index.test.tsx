import { MockToastProvider, render, screen } from "@/utils/test-utils";

import TokensTab, { TokensTabProps } from "..";

const projectId = 0;

const tokens: API.Token[] = [
  {
    apparatus_index: 1,
    id: 1,
    state: "one_variant",
    t: "text",
    index: 0,
  },
];

function TokensTabWithMockToastProvider({
  tokens,
  isError,
  isFetching,
  isLoading,
  isRefetching,
}: Partial<TokensTabProps>) {
  return (
    <>
      <MockToastProvider />
      <TokensTab
        tokens={tokens || undefined}
        isError={isError || false}
        isFetching={isFetching || false}
        isLoading={isLoading || false}
        isRefetching={isRefetching || false}
        projectId={projectId}
        refetch={async () => {}}
        determineIfTokenIsSelected={() => false}
        handleSelectToken={() => {}}
      />
    </>
  );
}

describe("TokensTab", () => {
  it("renders loader correctly on isLoading", () => {
    render(<TokensTabWithMockToastProvider isFetching tokens={tokens} />);

    expect(screen.getByText("project.loader_text")).toBeInTheDocument();
  });

  it("renders loader correctly on isFetching", () => {
    render(<TokensTabWithMockToastProvider isRefetching tokens={tokens} />);

    expect(screen.getByText("project.loader_text")).toBeInTheDocument();
  });

  it("renders loader correctly on isRefetching", () => {
    render(<TokensTabWithMockToastProvider isLoading />);

    expect(screen.getByText("project.loader_text")).toBeInTheDocument();
  });

  it("renders error correctly on isError", () => {
    render(<TokensTabWithMockToastProvider isError />);

    expect(screen.getByText("project.generic_error")).toBeInTheDocument();
  });

  it("renders correctly", () => {
    render(<TokensTabWithMockToastProvider tokens={tokens} />);

    const tokenElements = screen.getAllByTestId("token");

    expect(tokenElements[0]).toBeInTheDocument();
  });
});
