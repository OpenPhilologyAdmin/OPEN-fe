import ChevronRightIcon from "@/assets/images/icons/chevron-small-right.svg";
import Button from "@/components/button";
import Input from "@/components/input";
import Typography from "@/components/typography";
import styled from "styled-components";

const Main = styled.main`
  background: white;
  padding: 20px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 10px;
  border-radius: 10px;
  height: 80%;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

function StyleGuide() {
  return (
    <Main>
      <Column>
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
        <Button variant="primary" left={<ChevronRightIcon />}>
          Hello!
        </Button>
      </Column>
      <Column>
        <Input label="Hello" current={10} max={10} />
      </Column>
    </Main>
  );
}

export default StyleGuide;
