import { render } from "@/utils/test-utils";

import Table from "..";

describe("Table", () => {
  it("renders basic unchanged", () => {
    const { container } = render(
      <Table.Container>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Column 1</Table.Th>
            <Table.Th>Column 2</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>column 1</Table.Td>
            <Table.Td>column 2</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table.Container>,
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with active row unchanged", () => {
    const { container } = render(
      <Table.Container>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Column 1</Table.Th>
            <Table.Th>Column 2</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr active>
            <Table.Td>column 1</Table.Td>
            <Table.Td>column 2</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table.Container>,
    );

    expect(container).toMatchSnapshot();
  });
});
