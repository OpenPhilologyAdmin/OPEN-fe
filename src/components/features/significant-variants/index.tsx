import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import ListPointersIcon from "@/assets/images/icons/list-pointers.svg";
import ListRightIcon from "@/assets/images/icons/list-right.svg";
import SpinnerIcon from "@/assets/images/icons/spinner.svg";
import Button from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import BasePanel from "@/components/ui/panel";
import Toggle from "@/components/ui/toggle";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

import { useGetSignificantVariantsForProjectById } from "./query";

type SignificantVariantsProps = ComponentPropsWithoutRef<"div"> & {
  projectId?: number;
  isOpen: boolean;
  isRotatedWhenClosed?: boolean;
  togglePanelVisibility: () => void;
};

type MaskProps = {
  variant: "loader" | "error";
  text: string;
  refetch?: () => void;
};

type ViewProps = SignificantVariantsProps & {
  isLoading: boolean;
  isError: boolean;
  refetch?: () => void;
  significantVariants: API.SignificantVariant[];
  isRotatedWhenClosed?: boolean;
};

type DisplayMode = "text" | "list";

type PanelContentProps = {
  displayMode: DisplayMode;
  significantVariants: API.SignificantVariant[];
};

const Panel = styled(BasePanel)`
  height: 100%;
  width: 100%;
`;

const VariantListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const VariantAsText = styled(Typography).attrs({ variant: "small-regular" })`
  word-break: break-all;
  margin-right: 4px;
`;

const Index = styled(Typography).attrs({ variant: "small-bold" })`
  margin-right: 4px;
`;

const MaskWrapper = styled.div`
  position: relative;
  height: 50%;
  overflow-y: scroll;
`;

const StyledTypography = styled(Typography)`
  margin-right: 5px;
`;

function Mask({ text, variant, refetch }: MaskProps) {
  const { t } = useTranslation();

  return (
    <Panel
      headerSlots={{
        actionNode: (
          <Button type="button" mode="icon" variant="secondary" small>
            <SpinnerIcon />
          </Button>
        ),
        mainNodes: {
          action: <Toggle disabled />,
          text: <Typography>{t("project.significant_variants")}</Typography>,
        },
      }}
      isOpen={true}
    >
      {variant === "loader" && <MaskLoader text={text} />}
      {variant === "error" && refetch && (
        <MaskError text={text} buttonText={t("project.refresh")} refetch={refetch} />
      )}
    </Panel>
  );
}

function PanelContent({ significantVariants, displayMode }: PanelContentProps) {
  const { t } = useTranslation();

  if (significantVariants.length === 0)
    return <Typography>{t("project.no_significant_variants_message")}</Typography>;

  if (displayMode === "list") {
    return (
      <>
        {significantVariants.map(variant => (
          <VariantAsText key={variant.index}>
            <Index>({variant.index})</Index>
            <StyledTypography variant="small-text-bold">
              {variant.value.selected_reading}
            </StyledTypography>
            {variant.value.details}
          </VariantAsText>
        ))}
      </>
    );
  }

  if (displayMode === "text") {
    return (
      <VariantListWrapper>
        {significantVariants.map(variant => (
          <Typography key={variant.index} variant="small-regular">
            <Index>({variant.index})</Index>
            <StyledTypography variant="small-text-bold">
              {variant.value.selected_reading}
            </StyledTypography>
            {variant.value.details}
          </Typography>
        ))}
      </VariantListWrapper>
    );
  }

  return null;
}

function View({
  significantVariants,
  isLoading,
  isError,
  togglePanelVisibility,
  isRotatedWhenClosed,
  isOpen,
  refetch,
  ...props
}: ViewProps) {
  const { t } = useTranslation();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("text");

  const toggleDisplayMode = () =>
    setDisplayMode(previousState => {
      if (previousState === "text") return "list";

      return "text";
    });

  return (
    <Panel
      headerSlots={{
        actionNode: (
          <Button type="button" mode="icon" variant="secondary" small onClick={toggleDisplayMode}>
            {displayMode === "text" ? <ListRightIcon /> : <ListPointersIcon />}
          </Button>
        ),
        mainNodes: {
          action: (
            <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
          ),
          text: <Typography>{t("project.significant_variants")}</Typography>,
        },
      }}
      isOpen={isOpen}
      isRotatedWhenClosed={isRotatedWhenClosed}
      {...props}
    >
      {isLoading || isError ? (
        <MaskWrapper>
          {isLoading && <MaskLoader text={t("project.loader_text")} withBackgroundMask />}
          {isError && refetch && (
            <MaskError
              text={t("project.generic_error")}
              buttonText={t("project.refresh")}
              refetch={refetch}
              withBackgroundMask
            />
          )}
          <PanelContent displayMode={displayMode} significantVariants={significantVariants} />
        </MaskWrapper>
      ) : (
        <PanelContent displayMode={displayMode} significantVariants={significantVariants} />
      )}
    </Panel>
  );
}

function SignificantVariants({
  isOpen,
  projectId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  ...props
}: SignificantVariantsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isRefetching, isFetching, refetch } =
    useGetSignificantVariantsForProjectById({
      projectId,
    });
  const significantVariants = data?.records;

  if (isLoading && !significantVariants)
    return <Mask variant="loader" text={t("project.loader_text")} />;

  if (isError && !significantVariants)
    return <Mask variant="error" text={t("project.generic_error")} refetch={refetch} />;

  if (significantVariants) {
    return (
      <View
        projectId={projectId}
        isLoading={isRefetching || isFetching}
        isError={isError && !isRefetching}
        significantVariants={significantVariants}
        isOpen={isOpen}
        isRotatedWhenClosed={isRotatedWhenClosed}
        togglePanelVisibility={togglePanelVisibility}
        refetch={refetch}
        {...props}
      />
    );
  }

  return null;
}

export { Mask };
export default SignificantVariants;
