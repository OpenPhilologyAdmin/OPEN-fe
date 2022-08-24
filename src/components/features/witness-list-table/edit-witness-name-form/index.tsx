import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import CheckmarkIcon from "@/assets/images/icons/check.svg";
import EditIcon from "@/assets/images/icons/edit-2.svg";
import Button from "@/components/ui/button";
import Input, { InputLoader as BaseInputLoader, useCharacterLimit } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import { useInvalidateGetWitnessListByProjectId, useUpdateWitnessById } from "../query";

export type UpdateWitnessByIdData = {
  name: string;
};

export type EditWitnessNameFormProps = {
  name: string;
  projectId: number;
  witness: API.Witness;
};

export const FIELDS = {
  WITNESS_NAME: "name",
} as const;

const registerSchema = zod.object({
  [FIELDS.WITNESS_NAME]: zod.string().min(0).max(50),
});

const ButtonIconWithMarginLeft = styled(Button)`
  margin-left: 12px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 364px;
`;

const InputLoader = styled(BaseInputLoader)`
  width: 364px;
`;

function EditWitnessNameForm({ name, projectId, witness }: EditWitnessNameFormProps) {
  const [edit, setEdit] = useState(!witness.name);
  const { t } = useTranslation();
  const { invalidateGetWitnessListByProjectId } = useInvalidateGetWitnessListByProjectId();
  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<UpdateWitnessByIdData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name,
    },
  });
  const { mutate: updateWitnessById, isLoading } = useUpdateWitnessById({
    onSuccess: () => {
      toast.success(<Typography>{t("witness_list.witness_name_changed")}</Typography>);
      invalidateGetWitnessListByProjectId({ projectId });
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        if (apiError[FIELDS.WITNESS_NAME]) {
          toast.error(<Typography>{apiError[FIELDS.WITNESS_NAME]}</Typography>);
        }
      }
    },
  });

  const { current } = useCharacterLimit(watch(FIELDS.WITNESS_NAME));

  if (edit) {
    return (
      <Form
        onSubmit={handleSubmit(data => {
          updateWitnessById({
            data: {
              witness: { ...data, default: witness.default },
            },
            witnessId: witness.id,
            projectId,
          });
          setEdit(false);
        })}
      >
        <Input
          type="text"
          id={FIELDS.WITNESS_NAME}
          disabled={isLoading}
          errorMessage={errors[FIELDS.WITNESS_NAME]?.message}
          {...register(FIELDS.WITNESS_NAME)}
          {...getFieldState(FIELDS.WITNESS_NAME)}
          current={current}
          maxLength={50}
        />
        <ButtonIconWithMarginLeft
          data-testid="submit-button"
          mode="icon"
          type="submit"
          variant="tertiary"
          small
          onClick={() => setEdit(true)}
        >
          <CheckmarkIcon role="graphics-symbol" />
        </ButtonIconWithMarginLeft>
      </Form>
    );
  }

  return isLoading ? (
    <InputLoader />
  ) : (
    <>
      <Typography truncate>{name}</Typography>
      <ButtonIconWithMarginLeft
        data-testid="edit-button"
        type="button"
        mode="icon"
        variant="tertiary"
        small
        onClick={() => setEdit(true)}
      >
        <EditIcon role="graphics-symbol" />
      </ButtonIconWithMarginLeft>
    </>
  );
}

export default EditWitnessNameForm;
