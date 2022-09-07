import { ComponentPropsWithoutRef, ReactElement } from "react";

import SpinnerIcon from "@/assets/images/icons/spinner.svg";
import Button from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import BasePanel from "@/components/ui/panel";
import Toggle from "@/components/ui/toggle";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

type CommonsProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  isRotatedWhenClosed: boolean;
  isLoading: boolean;
  isError: boolean;
  togglePanelVisibility: () => void;
  refetch?: () => void;
  heading: string;
  actionNode: ReactElement;
};

export type VariantsPanelProps = CommonsProps & {
  buttonText: string;
  errorText: string;
  loaderText: string;
  isFetching: boolean;
  isRefetching: boolean;
};

type MaskProps = {
  actionNode: ReactElement;
  variant: "loader" | "error";
  heading: string;
  buttonText?: string;
  text?: string;
  isRotatedWhenClosed?: boolean;
  togglePanelVisibility: () => void;
  refetch?: () => void;
  isOpen: boolean;
};

type ViewProps = CommonsProps & {
  buttonText?: string;
  errorText?: string;
  loaderText?: string;
};

const Panel = styled(BasePanel)`
  height: 100%;
  width: 100%;
`;

const MaskWrapper = styled.div`
  position: relative;
  height: 50%;
  overflow-y: scroll;
`;

function Mask({
  actionNode,
  text,
  variant,
  buttonText,
  heading,
  isRotatedWhenClosed,
  togglePanelVisibility,
  isOpen,
  refetch,
}: MaskProps) {
  const showLoader = !!(variant === "loader" && text);
  const showError = !!(variant === "error" && refetch && buttonText && text);

  return (
    <Panel
      headerSlots={{
        actionNode: showLoader ? (
          <Button type="button" mode="icon" variant="secondary" small disabled>
            <SpinnerIcon />
          </Button>
        ) : (
          actionNode
        ),
        mainNodes: {
          action: (
            <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
          ),
          text: <Typography>{heading}</Typography>,
        },
      }}
      isOpen={isOpen}
      isRotatedWhenClosed={isRotatedWhenClosed}
    >
      {showLoader && <MaskLoader text={text} />}
      {showError && <MaskError text={text} buttonText={buttonText} refetch={refetch} />}
    </Panel>
  );
}

function View({
  actionNode,
  isLoading,
  isError,
  togglePanelVisibility,
  isRotatedWhenClosed,
  isOpen,
  refetch,
  children,
  heading,
  errorText,
  loaderText,
  buttonText,
  ...props
}: ViewProps) {
  const showLoader = !!(isLoading && loaderText);
  const showError = !!(isError && refetch && errorText && buttonText);

  return (
    <Panel
      headerSlots={{
        actionNode: actionNode,
        mainNodes: {
          action: (
            <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
          ),
          text: <Typography>{heading}</Typography>,
        },
      }}
      isOpen={isOpen}
      isRotatedWhenClosed={isRotatedWhenClosed}
      {...props}
    >
      {showLoader || showError ? (
        <MaskWrapper>
          {showLoader && <MaskLoader text={loaderText} withBackgroundMask />}
          {showError && (
            <MaskError
              text={errorText}
              buttonText={buttonText}
              refetch={refetch}
              withBackgroundMask
            />
          )}
          {children}
        </MaskWrapper>
      ) : (
        children
      )}
    </Panel>
  );
}

function VariantsPanel({
  actionNode,
  heading,
  buttonText,
  errorText,
  loaderText,
  isOpen,
  togglePanelVisibility,
  isRotatedWhenClosed,
  children,
  isLoading,
  isError,
  isRefetching,
  isFetching,
  refetch,
  ...props
}: VariantsPanelProps) {
  if (isLoading)
    return (
      <Mask
        actionNode={actionNode}
        isOpen={isOpen}
        togglePanelVisibility={togglePanelVisibility}
        isRotatedWhenClosed={isRotatedWhenClosed}
        heading={heading}
        variant="loader"
        text={loaderText}
      />
    );

  if (isError)
    return (
      <Mask
        actionNode={actionNode}
        isOpen={isOpen}
        togglePanelVisibility={togglePanelVisibility}
        isRotatedWhenClosed={isRotatedWhenClosed}
        variant="error"
        heading={heading}
        text={errorText}
        buttonText={buttonText}
        refetch={refetch}
      />
    );

  return (
    <View
      actionNode={actionNode}
      isOpen={isOpen}
      isLoading={isRefetching || isFetching}
      isError={isError && !isRefetching}
      heading={heading}
      errorText={errorText}
      loaderText={loaderText}
      buttonText={buttonText}
      togglePanelVisibility={togglePanelVisibility}
      isRotatedWhenClosed={isRotatedWhenClosed}
      {...props}
    >
      {children}
    </View>
  );
}

export { Mask };
export default VariantsPanel;
