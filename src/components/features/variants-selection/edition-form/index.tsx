import { useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import NewTypography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import AddEditorialRemark, { useAddEditorialRemark } from "./add-editorial-remark";
import { useUpdateVariantsForTokenById } from "./query";

type VariantsData = {
  variants: API.Variant[];
  editorialRemark?: API.EditorialRemark;
};

export type EditionFormProps = {
  projectId: number;
  tokenId: number;
  variants: API.Variant[];
  editorialRemark?: API.EditorialRemark;
  onVariantEditionSave?: () => Promise<void>;
  onCancel: () => void;
};

const ERROR_FIELDS = ["variants", "editorial_remark"];

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

function EditionForm({
  variants,
  projectId,
  tokenId,
  onCancel,
  onVariantEditionSave,
  editorialRemark,
}: EditionFormProps) {
  const { t } = useTranslation();
  const [variantsData, setVariantsData] = useState<VariantsData>({ variants, editorialRemark });
  const { showEditorialRemark, setShowEditorialRemark } = useAddEditorialRemark(
    !!variantsData.editorialRemark?.t,
  );
  const { mutate: updateVariantsForTokenById, isLoading } = useUpdateVariantsForTokenById({
    onSuccess: async () => {
      if (onVariantEditionSave) {
        await onVariantEditionSave();
      }

      toast.success(<Typography>{t("project.edit_token_variant_submit")}</Typography>);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        // Error for variants and editorial remark
        ERROR_FIELDS.forEach(field => {
          if (apiError[field]) {
            apiError[field].forEach(error => {
              toast.error(<NewTypography>{error}</NewTypography>);
            });
          }
        });
      }
    },
  });

  const handleSetVariantData = (variant: API.Variant, value: string) => {
    setVariantsData(previousVariantsData => ({
      editorialRemark: previousVariantsData.editorialRemark,
      variants: previousVariantsData.variants.map(currentVariant =>
        currentVariant.witness === variant.witness
          ? { ...currentVariant, t: value }
          : currentVariant,
      ),
    }));
  };

  return (
    <Form
      onSubmit={e => {
        e.stopPropagation();
        e.preventDefault();
        updateVariantsForTokenById({
          data: {
            token: {
              variants: variantsData.variants,
              editorial_remark: variantsData.editorialRemark,
            },
          },
          projectId,
          tokenId,
        });
      }}
    >
      {variantsData.variants.map(variant => (
        <TextArea
          key={variant.witness}
          id={variant.witness}
          value={variant.t}
          label={variant.witness}
          onChange={event => handleSetVariantData(variant, event.currentTarget.value)}
          resize
          adjustInitialHeightToContent
        />
      ))}
      <AddEditorialRemark
        initialEditorialRemark={editorialRemark}
        showEditorialRemark={showEditorialRemark}
        toggleEditorialRemarkVisibility={() => setShowEditorialRemark(true)}
        onEditorialRemarkSelect={editorialRemark =>
          setVariantsData(previousVariantsData => ({
            variants: previousVariantsData.variants,
            editorialRemark: editorialRemark,
          }))
        }
      />
      <ButtonsWrapper>
        <Button small type="submit" isLoading={isLoading} disabled={isLoading}>
          {t("project.save")}
        </Button>
        <Button
          small
          variant="secondary"
          type="button"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => {
            setShowEditorialRemark(false);
            onCancel();
          }}
        >
          {t("project.cancel")}
        </Button>
      </ButtonsWrapper>
    </Form>
  );
}

export default EditionForm;
