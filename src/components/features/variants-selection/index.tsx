import { ComponentPropsWithRef, useState } from "react";
import { useTranslation } from "next-i18next";

import EditIcon from "@/assets/images/icons/edit-2.svg";
import Button from "@/components/ui/button";
import ProjectPanel from "@/components/ui/project-panel";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

import EditionForm from "./edition-form";
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
  invalidateProjectViewQueriesCallback: () => Promise<void>;
};

type PanelContentProps = {
  isEditingVariants: boolean;
  projectId: number;
  tokenId: number;
  token?: API.TokenDetails;
  toggleIsEditingVariants: () => void;
  invalidateProjectViewQueriesCallback: () => Promise<void>;
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
  isEditingVariants,
  toggleIsEditingVariants,
  invalidateProjectViewQueriesCallback,
}: PanelContentProps) {
  const { t } = useTranslation();
  const { invalidateGetTokenDetailsForProjectById } = useInvalidateGetTokenDetailsForProjectById();
  const handleInvalidateProjectViewQueries = async () => {
    await invalidateGetTokenDetailsForProjectById(projectId, tokenId);
    await invalidateProjectViewQueriesCallback();
  };

  if (!token) return <Typography>{t("project.no_token_error")}</Typography>;

  return (
    <div>
      {isEditingVariants ? (
        <EditionForm
          projectId={projectId}
          tokenId={tokenId}
          variants={token.variants}
          editorialRemark={token.editorial_remark}
          onCancel={toggleIsEditingVariants}
          onVariantEditionSave={handleInvalidateProjectViewQueries}
        />
      ) : (
        <>
          {token.apparatus && (
            <ApparatusWrapper>
              <SelectedReading variant="body-bold">
                {token.apparatus.selected_reading}
              </SelectedReading>
              <Typography>{token.apparatus.details}</Typography>
            </ApparatusWrapper>
          )}
          <SelectionForm
            projectId={projectId}
            tokenId={tokenId}
            groupedVariants={token.grouped_variants}
            onGroupedVariantSelectionSubmit={handleInvalidateProjectViewQueries}
          />
        </>
      )}
    </div>
  );
}

function VariantsSelection({
  tokenId,
  projectId,
  isOpen,
  isRotatedWhenClosed,
  togglePanelVisibility,
  invalidateProjectViewQueriesCallback,
  ...props
}: VariantsSelectionProps) {
  const { t } = useTranslation();
  const [isEditingVariants, setIsEditingVariants] = useState(false);
  const toggleIsEditingVariants = () => setIsEditingVariants(previousValue => !previousValue);

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
    <ProjectPanel
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
        <Button
          type="button"
          mode="icon"
          variant="secondary"
          small
          onClick={toggleIsEditingVariants}
          aria-label={t("project.edit_toggle")}
        >
          <EditIcon />
        </Button>
      }
      {...props}
    >
      {!tokenId ? (
        <Typography>{t("project.select_token")}</Typography>
      ) : (
        <PanelContent
          token={token}
          tokenId={tokenId}
          projectId={projectId}
          isEditingVariants={isEditingVariants}
          toggleIsEditingVariants={toggleIsEditingVariants}
          invalidateProjectViewQueriesCallback={invalidateProjectViewQueriesCallback}
        />
      )}
    </ProjectPanel>
  );
}

export default VariantsSelection;
