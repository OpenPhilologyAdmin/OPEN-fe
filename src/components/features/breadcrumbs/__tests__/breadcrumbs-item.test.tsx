import { render, screen } from "@/utils/test-utils";

import { BreadcrumbsItem } from "../breadcrumbs-item";

const href = "/example";

describe("Breadcrumbs/BreadcrumbsItem", () => {
  it("renders correctly", () => {
    render(<BreadcrumbsItem href={href} />);
  });

  it("renders correctly with children", () => {
    const childMessage = "Hello";

    render(
      <BreadcrumbsItem href={href}>
        <span>{childMessage}</span>
      </BreadcrumbsItem>,
    );

    expect(screen.getByText(childMessage)).toBeInTheDocument();
  });
});
