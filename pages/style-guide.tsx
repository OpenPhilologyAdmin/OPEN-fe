import { useForm } from "react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ChevronRightIcon from "@/assets/images/icons/chevron-right.svg";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown";
import Input, { useCharacterLimit } from "@/components/ui/input";
import Radio from "@/components/ui/radio";
import { Container, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import Typography from "@/components/ui/typography";
import { ROUTES } from "@/constants/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

const schema = zod.object({
  name: zod.string().min(1, { message: "Required" }).max(100),
  age: zod.number().min(10),
  likesMe: zod.string().min(2),
  likesYou: zod.literal(true),
  likesUs: zod.literal(false),
});

const Main = styled.form`
  display: flex;
  column-gap: 30px;
  padding: 20px;
  border-radius: 10px;
  height: 80%;
  width: 100%;
  background: white;
  overflow: scroll;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  row-gap: 12px;
  column-gap: 30px;
  min-width: 300px;
  overflow: scroll;
`;

const ColumHeading = styled.h1`
  margin: 0 10px;
  font-size: 30px;
`;

const WideTable = styled(Container)`
  width: 100%;
`;

const WideTh = styled(Th)`
  width: 70%;
`;

function StyleGuide() {
  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { current: nameCurrent } = useCharacterLimit(watch("name"));

  return (
    <Main onSubmit={handleSubmit(d => console.log(d))}>
      <Column>
        <ColumHeading>Typography</ColumHeading>
        <Typography>hello</Typography>
        <Typography variant="header">hello</Typography>
        <Typography variant="body-bold">hello</Typography>
        <Typography variant="body-link">hello</Typography>
        <Typography variant="body-regular">hello</Typography>
        <Typography variant="button-default">hello</Typography>
        <Typography variant="button-small">hello</Typography>
        <Typography variant="small-bold">hello</Typography>
        <Typography variant="small-regular">hello</Typography>
        <Typography variant="small-text-bold">hello</Typography>
        <Typography variant="small-text-regular">hello</Typography>
        <Typography variant="small-text-super">hello</Typography>
      </Column>

      <Column>
        <ColumHeading>Input</ColumHeading>

        <Input
          type="text"
          {...register("name")}
          {...getFieldState("name")}
          disabled={true}
          current={nameCurrent}
          maxLength={100}
        />
        <Input
          type="text"
          {...register("name")}
          {...getFieldState("name")}
          current={nameCurrent}
          maxLength={100}
        />
        {errors.name?.message && <p>{errors.name?.message}</p>}
        <Input
          type="number"
          {...register("age", { valueAsNumber: true })}
          {...getFieldState("age")}
        />
        {errors.age?.message && <p>{errors.age?.message}</p>}
        <Input
          type="text"
          {...register("asd")}
          {...getFieldState("asd")}
          invalid
          errorMessage="error"
        />
        <input type="submit" />
      </Column>
      <Column>
        <ColumHeading>Radio</ColumHeading>

        <Radio value="1" disabled />
        <Radio value="1" disabled checked />
        <Radio label="Label" value="2" disabled id={"withValue2"} />
        <Radio {...register("likesMe")} {...getFieldState("likesMe")} value="3" />
        <Radio
          label="Label"
          {...register("likesMe")}
          {...getFieldState("likesMe")}
          value="44"
          id={"withValue44"}
        />
        {errors.likesMe?.message && <p>{errors.likesMe?.message}</p>}

        <input type="submit" />
      </Column>
      <Column>
        <ColumHeading>Checkbox</ColumHeading>

        <Checkbox disabled />
        <Checkbox checked disabled />
        <Checkbox label={"Label"} id={"likesHim"} disabled />
        <Checkbox {...register("likesYou")} {...getFieldState("likesYou")} id={"likesYou"} />
        <Checkbox
          {...register("likesUs")}
          {...getFieldState("likesUs")}
          label={"Label"}
          id={"likesUs"}
        />
        {errors.likesYou?.message && <p>{errors.likesYou?.message}</p>}
        {errors.likesUs?.message && <p>{errors.likesUs?.message}</p>}

        <input type="submit" />
      </Column>

      <Column>
        <ColumHeading>Button</ColumHeading>
        <Button variant="primary" left={<ChevronRightIcon />} disabled>
          Button
        </Button>
        <Button variant="secondary" left={<ChevronRightIcon />} disabled>
          Button
        </Button>
        <Button variant="tertiary" left={<ChevronRightIcon />} disabled>
          Button
        </Button>
        <Button variant="primary" left={<ChevronRightIcon />}>
          Button
        </Button>
        <Button variant="secondary" left={<ChevronRightIcon />}>
          Button
        </Button>
        <Button variant="tertiary" left={<ChevronRightIcon />}>
          Button
        </Button>
      </Column>

      <Column>
        <ColumHeading>Button icon</ColumHeading>
        <Button variant="primary" mode="icon">
          <ChevronRightIcon />
        </Button>
        <Button variant="primary" mode="icon" disabled>
          <ChevronRightIcon />
        </Button>
        <Button variant="primary" mode="icon" small>
          <ChevronRightIcon />
        </Button>
        <Button variant="primary" mode="icon" small disabled>
          <ChevronRightIcon />
        </Button>

        <Button variant="secondary" mode="icon">
          <ChevronRightIcon />
        </Button>
        <Button variant="secondary" mode="icon" disabled>
          <ChevronRightIcon />
        </Button>
        <Button variant="secondary" mode="icon" small>
          <ChevronRightIcon />
        </Button>
        <Button variant="secondary" mode="icon" disabled small>
          <ChevronRightIcon />
        </Button>

        <Button variant="tertiary" mode="icon">
          <ChevronRightIcon />
        </Button>
        <Button variant="tertiary" mode="icon" disabled>
          <ChevronRightIcon />
        </Button>
        <Button variant="tertiary" mode="icon" small>
          <ChevronRightIcon />
        </Button>
        <Button variant="tertiary" mode="icon" small disabled>
          <ChevronRightIcon />
        </Button>
      </Column>
      <Column>
        <ColumHeading>Dropdown</ColumHeading>

        <Dropdown label="Label">
          <DropdownItem label="Label 1" value="option1" />
          <DropdownItem label="Label 2" value="option2" />
          <DropdownItem label="Label 3" value="option3" selected />
          <DropdownItem label="Label 4" value="option4" />
        </Dropdown>
        <Dropdown label="Label" multiple>
          <DropdownItem label="Label 1" value="option1" selected />
          <DropdownItem label="Label 2" value="option2" />
          <DropdownItem label="Label 3" value="option3" selected />
          <DropdownItem label="Label 4" value="option4" />
        </Dropdown>
      </Column>
      <Column>
        <ColumHeading>Table</ColumHeading>

        <div style={{ display: "flex", alignSelf: "normal", width: "1000px" }}>
          <WideTable>
            <Thead>
              <Tr>
                <WideTh align="left">Document name</WideTh>
                <Th>Creation date</Th>
                <Th>Witnesses</Th>
                <Th>Export</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td align="left">
                  <Button variant="tertiary" small href="#">
                    Lorem Ipsum
                  </Button>
                </Td>
                <Td>2022-02-16</Td>
                <Td>3</Td>
                <Td>E</Td>
                <Td>D</Td>
              </Tr>
              <Tr active>
                <Td align="left">
                  <Button variant="tertiary" small href="#">
                    Lorem Ipsum
                  </Button>
                </Td>
                <Td>2022-02-16</Td>
                <Td>3</Td>
                <Td>E</Td>
                <Td>D</Td>
              </Tr>
              <Tr>
                <Td align="left">
                  <Button variant="tertiary" small href="#">
                    Lorem Ipsum
                  </Button>
                </Td>
                <Td>2022-02-16</Td>
                <Td>3</Td>
                <Td>E</Td>
                <Td>D</Td>
              </Tr>
            </Tbody>
          </WideTable>
        </div>
      </Column>
    </Main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (process.env.NODE_ENV !== "development") {
    return {
      redirect: {
        destination: ROUTES.HOME(),
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

export default StyleGuide;
