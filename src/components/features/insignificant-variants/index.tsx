import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import ContinuousIcon from "@/assets/images/icons/continuous.svg";
import ListPointersIcon from "@/assets/images/icons/list-pointers.svg";
import Button from "@/components/ui/button";
import ProjectPanel from "@/components/ui/project-panel";
import Typography from "@/components/ui/typography/new_index";
import styled from "styled-components";

import { useGetInsignificantVariantsForProjectById } from "./query";

type InsignificantVariantsProps = ComponentPropsWithoutRef<"div"> & {
  projectId?: number;
  isOpen: boolean;
  togglePanelVisibility: () => void;
  isRotatedWhenClosed: boolean;
  apparatusIndexVisible?: boolean;
};

type DisplayMode = "text" | "list";

type PanelContentProps = {
  displayMode: DisplayMode;
  insignificantVariants?: API.InsignificantVariant[];
  apparatusIndexVisible?: boolean;
};

const VariantListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypographyWithForcedFont = styled(Typography)`
  &&& {
    font-family: "Roboto Slab" !important;
    line-height: 24px;
  }
`;

const VariantAsText = styled(TypographyWithForcedFont).attrs({ variant: "small" })`
  word-break: break-all;
  margin-right: 4px;
`;

const Index = styled(TypographyWithForcedFont).attrs({
  variant: "strong",
  compact: true,
  shrink: true,
  bold: true,
})`
  margin-right: 4px;
`;

const SelectedReading = styled(TypographyWithForcedFont).attrs({
  variant: "small",
  bold: true,
})`
  margin-right: 5px;
`;

function PanelContent({
  insignificantVariants,
  displayMode,
  apparatusIndexVisible,
}: PanelContentProps) {
  const { t } = useTranslation();

  if (!insignificantVariants || insignificantVariants.length === 0)
    return <Typography>{t("project.no_insignificant_variants_message")}</Typography>;

  if (displayMode === "list") {
    return (
      <>
        {insignificantVariants.map(variant => (
          <VariantAsText key={variant.index}>
            {apparatusIndexVisible && <Index>({variant.index})</Index>}
            <SelectedReading>{variant.value.selected_reading}</SelectedReading>
            {variant.value.details}
          </VariantAsText>
        ))}
      </>
    );
  }

  if (displayMode === "text") {
    return (
      <VariantListWrapper>
        {insignificantVariants.map(variant => (
          <TypographyWithForcedFont key={variant.index} variant="small">
            {apparatusIndexVisible && <Index>({variant.index})</Index>}
            <SelectedReading>{variant.value.selected_reading}</SelectedReading>
            {variant.value.details}
          </TypographyWithForcedFont>
        ))}
      </VariantListWrapper>
    );
  }

  return null;
}

function InsignificantVariants({
  isOpen,
  projectId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  apparatusIndexVisible = true,
  ...props
}: InsignificantVariantsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isRefetching, isFetching, refetch } =
    useGetInsignificantVariantsForProjectById({
      projectId,
    });
  const [displayMode, setDisplayMode] = useState<DisplayMode>("text");

  const insignificantVariants = data?.records;

  const toggleDisplayMode = () =>
    setDisplayMode(previousState => {
      if (previousState === "text") return "list";

      return "text";
    });

  return (
    <ProjectPanel
      isOpen={isOpen}
      isError={isError && !insignificantVariants}
      isLoading={isLoading && !insignificantVariants}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isRotatedWhenClosed={isRotatedWhenClosed}
      heading={t("project.insignificant_variants")}
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
        insignificantVariants={insignificantVariants}
        apparatusIndexVisible={apparatusIndexVisible}
      />
    </ProjectPanel>
  );
}

export default InsignificantVariants;
