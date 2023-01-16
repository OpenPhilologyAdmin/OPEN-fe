import { render, screen, userEvent } from "@/utils/test-utils";

import Token from "..";

const getToken = (state: API.TokenState): API.Token => ({
  apparatus_index: 123,
  id: 1,
  state,
  t: "value123",
  index: 1,
});

describe("Token", () => {
  it("renders a Token unchanged in read mode", () => {
    const token = getToken("one_variant");
    const { container } = render(<Token mode="READ" token={token} />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token unchanged in edit mode and in one_variant state", () => {
    const token = getToken("one_variant");

    const { container } = render(<Token mode="EDIT" token={token} />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token unchanged in edit mode and in evaluated_with_multiple state", () => {
    const token = getToken("evaluated_with_multiple");

    const { container } = render(<Token mode="EDIT" token={token} />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token unchanged in edit mode and in evaluated_with_single state", () => {
    const token = getToken("evaluated_with_single");

    const { container } = render(<Token mode="EDIT" token={token} />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token unchanged in edit mode and in not_evaluated state", () => {
    const token = getToken("not_evaluated");

    const { container } = render(<Token mode="EDIT" token={token} />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token unchanged in edit mode and highlighted", () => {
    const token = getToken("evaluated_with_single");

    const { container } = render(<Token mode="EDIT" token={token} highlighted />);

    expect(screen.getByText(token.t)).toBeInTheDocument();
    expect(screen.getByText(`(${token.apparatus_index})`)).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders a Token and fires callback on click", async () => {
    const handleSelectToken = jest.fn();
    const user = userEvent.setup();
    const token = getToken("evaluated_with_single");

    render(<Token mode="EDIT" token={token} highlighted onSelectToken={handleSelectToken} />);

    expect(handleSelectToken).toHaveBeenCalledTimes(0);

    const tokenElement = screen.getByText(token.t);

    await user.click(tokenElement);

    expect(handleSelectToken).toHaveBeenCalledTimes(1);
  });

  it("renders a Token with apparatus index when visible", () => {
    const token = getToken("evaluated_with_single");

    render(<Token mode="EDIT" token={token} highlighted apparatusIndexVisible />);

    expect(screen.getByText("(123)")).toBeInTheDocument();
  });

  it("renders a Token without apparatus index when hidden", () => {
    const token = getToken("evaluated_with_single");

    render(<Token mode="EDIT" token={token} highlighted apparatusIndexVisible={false} />);

    expect(screen.queryByText("(123)")).not.toBeInTheDocument();
  });
});
