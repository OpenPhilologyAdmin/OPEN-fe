import { render } from "@/utils/test-utils";

import { Container, Tbody, Td, Th, Thead, Tr } from "..";

describe("Table", () => {
  it("renders basic unchanged", () => {
    const { container } = render(
      <Container>
        <Thead>
          <Tr>
            <Th>Column 1</Th>
            <Th>Column 2</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>column 1</Td>
            <Td>column 2</Td>
          </Tr>
        </Tbody>
      </Container>,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with active row unchanged", () => {
    const { container } = render(
      <Container>
        <Thead>
          <Tr>
            <Th>Column 1</Th>
            <Th>Column 2</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr active>
            <Td>column 1</Td>
            <Td>column 2</Td>
          </Tr>
        </Tbody>
      </Container>,
    );

    expect(container).toMatchSnapshot();
  });
});
