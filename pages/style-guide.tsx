import { useForm } from "react-hook-form";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ChevronRightIcon from "@/assets/images/icons/chevron-right.svg";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Dropdown, { DropdownItem } from "@/components/ui/dropdown";
import Input, { useCharacterLimit } from "@/components/ui/input";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import Modal, { useModal } from "@/components/ui/modal";
import Panel, { usePanel } from "@/components/ui/panel";
import Radio from "@/components/ui/radio";
import Sup from "@/components/ui/sup";
import { Container, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import TextArea from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import Toggle from "@/components/ui/toggle";
import Typography from "@/components/ui/typography";
import NewTypography from "@/components/ui/typography/new_index";
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
  isToggle: zod.literal(false),
  isNotToggle: zod.literal(true),
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  row-gap: 12px;
  min-width: 500px;
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

  const { isOpen, togglePanelVisibility } = usePanel();
  const { isOpen: isModalOpen, toggleModalVisibility } = useModal();
  const { current: nameCurrent } = useCharacterLimit(watch("name"));

  return (
    <Main onSubmit={handleSubmit(d => console.log(d))}>
      <Row>
        <Column>
          <ColumHeading>New Typography</ColumHeading>
          <NewTypography>hello</NewTypography>
          <NewTypography variant="header">header</NewTypography>
          <NewTypography variant="body" bold>
            body-bold
          </NewTypography>
          <NewTypography variant="body" link>
            body-link
          </NewTypography>
          <NewTypography variant="body">body-regular</NewTypography>
          <NewTypography variant="small" bold>
            button-small
          </NewTypography>
          <NewTypography variant="small">tiny</NewTypography>
          <NewTypography variant="regular">text-regular</NewTypography>
          <NewTypography variant="regular" bold>
            text-bold
          </NewTypography>
          <NewTypography variant="strong" compact bold>
            text-super
          </NewTypography>
          <NewTypography variant="strong" compact shrink bold>
            small-bold
          </NewTypography>
          <NewTypography variant="small">small-regular</NewTypography>
          <NewTypography variant="strong" compact shrink bold>
            small-text-bold
          </NewTypography>
          <NewTypography variant="strong" compact shrink>
            small-text-regular
          </NewTypography>
          <NewTypography variant="strong" compact bold>
            small-text-super
          </NewTypography>
        </Column>
        <Column>
          <ColumHeading>Typography</ColumHeading>
          <Typography>hello</Typography>
          <Typography variant="header">header</Typography>
          <Typography variant="body-bold">body-bold</Typography>
          <Typography variant="body-link">body-link</Typography>
          <Typography variant="body-regular">body-regular</Typography>
          <Typography variant="button-small">button-small</Typography>
          <Typography variant="tiny">tiny</Typography>
          <Typography variant="text-regular">text-regular</Typography>
          <Typography variant="text-bold">text-bold</Typography>
          <Typography variant="text-super">text-super</Typography>
          <Typography variant="small-bold">small-bold</Typography>
          <Typography variant="small-regular">small-regular</Typography>
          <Typography variant="small-text-bold">small-text-bold</Typography>
          <Typography variant="small-text-regular">small-text-regular</Typography>
          <Typography variant="small-text-super">small-text-super</Typography>
        </Column>
      </Row>

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
        <ColumHeading>TextArea</ColumHeading>

        <TextArea
          {...register("name")}
          {...getFieldState("name")}
          disabled={true}
          current={nameCurrent}
          maxLength={100}
          resize
        />
        <TextArea
          {...register("name")}
          {...getFieldState("name")}
          current={nameCurrent}
          maxLength={100}
          resize
        />
        <TextArea
          label="lalala"
          {...register("name")}
          {...getFieldState("name")}
          current={nameCurrent}
          maxLength={100}
        />
        {errors.name?.message && <p>{errors.name?.message}</p>}
        <TextArea
          {...register("asd")}
          {...getFieldState("asd")}
          invalid
          errorMessage="error"
          resize
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
        <Button variant="primary" destruct left={<ChevronRightIcon />}>
          Button
        </Button>
        <Button variant="secondary" destruct left={<ChevronRightIcon />}>
          Button
        </Button>
        <Button variant="tertiary" destruct left={<ChevronRightIcon />}>
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
        <Button variant="primary" mode="icon" small destruct>
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
        <Button variant="secondary" mode="icon" small destruct>
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
        <Button variant="tertiary" mode="icon" small destruct>
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
      <Column>
        <ColumHeading>Sup</ColumHeading>
        <Typography>
          text with <Sup>sup</Sup>
        </Typography>
      </Column>
      <Column>
        <ColumHeading>Panel</ColumHeading>
        <Panel
          headerSlots={{
            actionNode: (
              <Button type="button" variant="secondary" small>
                action
              </Button>
            ),
            mainNodes: {
              action: (
                <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
              ),
              text: <Typography>text</Typography>,
            },
          }}
          isOpen={isOpen}
        >
          panel children
        </Panel>
        <Panel
          headerSlots={{
            actionNode: (
              <Button type="button" variant="secondary" small>
                action
              </Button>
            ),
            mainNodes: {
              action: (
                <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
              ),
              text: <Typography>text</Typography>,
            },
          }}
          isOpen={isOpen}
          isRotatedWhenClosed={false}
        >
          panel children
        </Panel>
      </Column>
      <Column>
        <ColumHeading>Mask loading</ColumHeading>
        <MaskLoader text="Loading" />
      </Column>
      <Column>
        <ColumHeading>Mask error</ColumHeading>
        <MaskError text="Error" buttonText="retry" refetch={() => {}} />
      </Column>
      <Column>
        <ColumHeading>Modal</ColumHeading>
        <Button onClick={toggleModalVisibility} type="button">
          open
        </Button>

        <Modal isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
          <Button onClick={toggleModalVisibility} type="button">
            close
          </Button>
        </Modal>
      </Column>
      <Column>
        <ColumHeading>Toast</ColumHeading>
        <Button
          onClick={() => {
            toast.warn(<Typography>warn</Typography>);
            toast.error(<Typography>error</Typography>);
            toast.info(<Typography>info</Typography>);
            toast.success(<Typography>success</Typography>);
          }}
          type="button"
        >
          spam toasts
        </Button>
      </Column>
      <Column>
        <ColumHeading>Toggle</ColumHeading>
        <Toggle disabled />
        <Toggle checked disabled />
        <Toggle label={"Label"} id={"likesHim"} disabled />
        <Toggle
          {...register("isToggle")}
          {...getFieldState("isToggle")}
          label={"Label"}
          id={"isToggle"}
        />
        <Toggle
          {...register("isNotToggle")}
          {...getFieldState("isNotToggle")}
          label={"Label"}
          id={"isNotToggle"}
        />
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
