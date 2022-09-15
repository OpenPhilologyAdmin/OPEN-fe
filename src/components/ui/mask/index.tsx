import EmoteSadIcon from "@/assets/images/icons/emote-sad.svg";
import RefreshSmallIcon from "@/assets/images/icons/refresh-small.svg";
import SpinnerIcon from "@/assets/images/icons/spinner.svg";
import styled, { css, keyframes } from "styled-components";

import Button from "../button";
import Typography from "../typography";

type MaskProps = {
  text: string;
  withBackgroundMask?: boolean;
};

type LoaderProps = MaskProps;

type ErrorProps = MaskProps & {
  refetch: () => void;
  buttonText: string;
};

type StyledProps = {
  withBackgroundMask: boolean;
};

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${({ withBackgroundMask }) =>
    withBackgroundMask &&
    css`
      position: absolute;
      top: 0;
      left: 0;
    `};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 20;
`;

const Spinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 8px;
    animation: ${rotateAnimation} 1s linear infinite;
  }
`;

const ErrorContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.error};
`;

const EmoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.colors.error};
  }
`;

const MaskBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  backdrop-filter: blur(1px);
  z-index: 15;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
`;

function MaskLoader({ withBackgroundMask, text }: LoaderProps) {
  return (
    <Wrapper withBackgroundMask={!!withBackgroundMask}>
      {withBackgroundMask && <MaskBackground />}
      <Content>
        <Spinner>
          <SpinnerIcon />
        </Spinner>
        <Typography>{text}</Typography>
      </Content>
    </Wrapper>
  );
}

function MaskError({ withBackgroundMask, text, refetch, buttonText }: ErrorProps) {
  return (
    <Wrapper withBackgroundMask={!!withBackgroundMask}>
      {withBackgroundMask && <MaskBackground />}
      <Content>
        <ErrorContentsWrapper>
          <EmoteWrapper>
            <EmoteSadIcon />
          </EmoteWrapper>
          <Typography>{text}</Typography>
          <Button variant="secondary" small onClick={refetch} left={<RefreshSmallIcon />}>
            {buttonText}
          </Button>
        </ErrorContentsWrapper>
      </Content>
    </Wrapper>
  );
}

export { MaskLoader, MaskError };
