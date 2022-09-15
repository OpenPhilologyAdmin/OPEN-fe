import { useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useUpdateVariantsForTokenById } from "./query";

export type EditionFormProps = {
  projectId: number;
  tokenId: number;
  variants: API.Variant[];
  onVariantEditionSave?: () => Promise<void>;
  onCancel: () => void;
};

const ERROR_FIELDS = ["variants"];

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

const EditorialRemarkButton = styled(Button)`
  margin: 6px 0 6px 0;
`;

/** Exception to react-hook-form rule from the README.
 * This component uses controlled inputs and doesn't use react-hook-form.
 * The reason for this is that the inputs are dynamic.
 * The purpose of the library is to make it easier to handle forms, here it wouldn't be the case.
 */
function EditionForm({
  variants,
  projectId,
  tokenId,
  onCancel,
  onVariantEditionSave,
}: EditionFormProps) {
  const { t } = useTranslation();
  const [variantsData, setVariantsData] = useState(variants);
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

        // Error for variants
        if (apiError[ERROR_FIELDS[0]]) {
          toast.error(<Typography>{apiError[ERROR_FIELDS[0]]}</Typography>);
        }
      }
    },
  });
  const handleSetVariantData = (variant: API.Variant, value: string) => {
    setVariantsData(previousVariantsData =>
      previousVariantsData.map(currentVariant =>
        currentVariant.witness === variant.witness
          ? { ...currentVariant, t: value }
          : currentVariant,
      ),
    );
  };

  return (
    <Form
      onSubmit={e => {
        e.stopPropagation();
        e.preventDefault();
        updateVariantsForTokenById({
          data: {
            token: {
              variants: variantsData,
            },
          },
          projectId,
          tokenId,
        });
      }}
    >
      {variantsData.map(variant => (
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
      <EditorialRemarkButton disabled variant="tertiary" small type="button">
        {t("project.add_editorial_remark")}
      </EditorialRemarkButton>
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
          onClick={onCancel}
        >
          {t("project.cancel")}
        </Button>
      </ButtonsWrapper>
    </Form>
  );
}

export default EditionForm;
