import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import ContinuousIcon from "@/assets/images/icons/continuous.svg";
import ListPointersIcon from "@/assets/images/icons/list-pointers.svg";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import VariantsPanel from "@/components/ui/variants-panel";
import styled from "styled-components";

import { useGetSignificantVariantsForProjectById } from "./query";

type DisplayMode = "text" | "list";

type SignificantVariantsProps = ComponentPropsWithoutRef<"div"> & {
  projectId?: number;
  isOpen: boolean;
  isRotatedWhenClosed: boolean;
  togglePanelVisibility: () => void;
  apparatusIndexVisible?: boolean;
};

type PanelContentProps = {
  displayMode: DisplayMode;
  significantVariants?: API.SignificantVariant[];
  apparatusIndexVisible?: boolean;
};

const VariantListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const VariantAsText = styled(Typography).attrs({ variant: "small-regular" })`
  word-break: break-all;
  margin-right: 4px;
`;

const Index = styled(Typography).attrs({ variant: "small-bold" })`
  margin-right: 4px;
`;

const StyledTypography = styled(Typography)`
  margin-right: 5px;
`;

function PanelContent({
  significantVariants,
  displayMode,
  apparatusIndexVisible,
}: PanelContentProps) {
  const { t } = useTranslation();

  if (!significantVariants || significantVariants.length === 0)
    return <Typography>{t("project.no_significant_variants_message")}</Typography>;

  if (displayMode === "list") {
    return (
      <>
        {significantVariants.map(variant => (
          <VariantAsText key={variant.index}>
            {apparatusIndexVisible && <Index>({variant.index})</Index>}
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
            {apparatusIndexVisible && <Index>({variant.index})</Index>}
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

function SignificantVariants({
  isOpen,
  projectId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  apparatusIndexVisible = true,
  ...props
}: SignificantVariantsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isRefetching, isFetching, refetch } =
    useGetSignificantVariantsForProjectById({
      projectId,
    });
  const significantVariants = data?.records;

  const [displayMode, setDisplayMode] = useState<DisplayMode>("text");

  const toggleDisplayMode = () =>
    setDisplayMode(previousState => {
      if (previousState === "text") return "list";

      return "text";
    });

  return (
    <VariantsPanel
      isOpen={isOpen}
      isError={isError && !significantVariants}
      isLoading={isLoading && !significantVariants}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isRotatedWhenClosed={isRotatedWhenClosed}
      heading={t("project.significant_variants")}
      buttonText={t("project.refresh")}
      errorText={t("project.generic_error")}
      loaderText={t("project.loader_text")}
      refetch={refetch}
      togglePanelVisibility={togglePanelVisibility}
      actionNode={
        <Button type="button" mode="icon" variant="secondary" small onClick={toggleDisplayMode}>
          {displayMode === "text" ? <ContinuousIcon /> : <ListPointersIcon />}
        </Button>
      }
      {...props}
    >
      <PanelContent
        displayMode={displayMode}
        significantVariants={significantVariants}
        apparatusIndexVisible={apparatusIndexVisible}
      />
    </VariantsPanel>
  );
}

export default SignificantVariants;
