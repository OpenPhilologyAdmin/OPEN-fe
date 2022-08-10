import { capitalize } from "@/utils/capitalize";
import { render, screen } from "@/utils/test-utils";

import Breadcrumbs, { BreadcrumbsItem } from "..";

const routeOne = "/example";
const routeTwo = "/hello";
const breadcrumbs = [
  {
    href: routeOne,
    label: capitalize(routeOne),
  },
  {
    href: routeTwo,
    label: capitalize(routeTwo),
  },
];

describe("Breadcrumbs", () => {
  it("renders correctly in light variant", () => {
    render(<Breadcrumbs variant="LIGHT" />);
  });

  it("renders correctly in dark variant", () => {
    render(<Breadcrumbs variant="DARK" />);
  });

  it("renders correctly with BreadcrumbsItems", () => {
    render(
      <Breadcrumbs variant="LIGHT">
        <BreadcrumbsItem href={breadcrumbs[0].href}>{breadcrumbs[0].label}</BreadcrumbsItem>
        <BreadcrumbsItem href={breadcrumbs[1].href}>{breadcrumbs[1].label}</BreadcrumbsItem>
      </Breadcrumbs>,
    );

    expect(screen.getByText(breadcrumbs[0].label)).toBeInTheDocument();
    expect(screen.getByText(breadcrumbs[1].label)).toBeInTheDocument();
  });
});
