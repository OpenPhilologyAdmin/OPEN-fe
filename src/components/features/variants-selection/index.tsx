import { ComponentPropsWithRef } from "react";
import { useTranslation } from "next-i18next";

import EditIcon from "@/assets/images/icons/edit-2.svg";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import VariantsPanel from "@/components/ui/variants-panel";
import styled from "styled-components";

import {
  useGetTokenDetailsForProjectById,
  useInvalidateGetTokenDetailsForProjectById,
} from "./query";
import SelectionForm from "./selection-form";

export type VariantsSelectionProps = ComponentPropsWithRef<"div"> & {
  projectId: number;
  tokenId: number | null;
  isOpen: boolean;
  isRotatedWhenClosed: boolean;
  togglePanelVisibility: () => void;
  onGroupedVariantSelectionSubmit: () => Promise<void>;
};

type PanelContentProps = {
  projectId: number;
  tokenId: number;
  token?: API.TokenDetails;
  onGroupedVariantSelectionSubmit: () => Promise<void>;
};

const SelectedReading = styled(Typography)`
  margin-right: 4px;
`;

const ApparatusWrapper = styled.div`
  margin-bottom: 12px;
`;

function PanelContent({
  projectId,
  tokenId,
  token,
  onGroupedVariantSelectionSubmit,
}: PanelContentProps) {
  const { t } = useTranslation();
  const { invalidateGetTokenDetailsForProjectById } = useInvalidateGetTokenDetailsForProjectById();

  if (!token) return <Typography>{t("project.no_token_error")}</Typography>;

  return (
    <div>
      {token.apparatus && (
        <ApparatusWrapper>
          <SelectedReading variant="body-bold">{token.apparatus.selected_reading}</SelectedReading>
          <Typography>{token.apparatus.details}</Typography>
        </ApparatusWrapper>
      )}
      <SelectionForm
        projectId={projectId}
        tokenId={tokenId}
        groupedVariants={token.grouped_variants}
        onGroupedVariantSelectionSubmit={async () => {
          await invalidateGetTokenDetailsForProjectById(projectId, tokenId);
          await onGroupedVariantSelectionSubmit();
        }}
      />
    </div>
  );
}

function VariantsSelection({
  tokenId,
  projectId,
  isOpen,
  isRotatedWhenClosed,
  togglePanelVisibility,
  onGroupedVariantSelectionSubmit,
  ...props
}: VariantsSelectionProps) {
  const { t } = useTranslation();
  const {
    data: token,
    isError,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useGetTokenDetailsForProjectById({
    projectId,
    tokenId,
  });

  return (
    <VariantsPanel
      isOpen={isOpen}
      isError={isError && !token}
      isLoading={isLoading && !token}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isRotatedWhenClosed={isRotatedWhenClosed}
      heading={t("project.variants")}
      buttonText={t("project.refresh")}
      errorText={t("project.generic_error")}
      loaderText={t("project.loader_text")}
      refetch={refetch}
      togglePanelVisibility={togglePanelVisibility}
      actionNode={
        <Button type="button" mode="icon" variant="secondary" small disabled>
          <EditIcon />
        </Button>
      }
      {...props}
    >
      {!tokenId ? (
        <Typography>{t("project.select_token")}</Typography>
      ) : (
        <PanelContent
          onGroupedVariantSelectionSubmit={onGroupedVariantSelectionSubmit}
          token={token}
          tokenId={tokenId}
          projectId={projectId}
        />
      )}
    </VariantsPanel>
  );
}

export default VariantsSelection;
