import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import PlusIcon from "@/assets/images/icons/plus.svg";
import Button from "@/components/ui/button";
import Modal, { useModal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Input, { useCharacterLimit } from "../../../ui/input";
import { useInvalidateGetInsignificantVariantsForProjectByIdQuery } from "../../insignificant-variants/query";
import { useInvalidateGetSignificantVariantsForProjectByIdQuery } from "../../significant-variants/query";
import { useInvalidateGetTokenDetailsForProjectById } from "../../variants-selection/query";
import { useInvalidateGetWitnessListByProjectId } from "../query";
import { useAddWitness } from "./query";

export type AddWitnessFormData = {
  name: string;
  siglum: string;
};

export type AddWitnessFormProps = {
  disabled?: boolean;
  variant?: "primary" | "secondary";
  project: API.Project;
  small?: boolean;
  tokenId?: number;
};

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

export const FIELDS = {
  NAME: "name",
  SIGLUM: "siglum",
} as const;

function AddWitnessButton({
  disabled = false,
  variant = "primary",
  project,
  small = false,
  tokenId,
}: AddWitnessFormProps) {
  const { t } = useTranslation();
  const { isOpen: isModalOpen, toggleModalVisibility } = useModal();
  const { invalidateGetWitnessListByProjectId } = useInvalidateGetWitnessListByProjectId();
  const handleCancel = () => {
    toggleModalVisibility();
    reset();
  };

  const { invalidateGetTokenDetailsForProjectById } = useInvalidateGetTokenDetailsForProjectById();
  const { invalidateGetInsignificantVariantsForProjectById } =
    useInvalidateGetInsignificantVariantsForProjectByIdQuery();
  const { invalidateGetSignificantVariantsForProjectById } =
    useInvalidateGetSignificantVariantsForProjectByIdQuery();

  const {
    mutate: addWitness,
    isLoading,
    error: axiosError,
  } = useAddWitness({
    onSuccess: ({ data: { name, siglum } }) => {
      invalidateGetWitnessListByProjectId({ projectId: project.id });
      tokenId && invalidateGetTokenDetailsForProjectById(project.id, tokenId);
      invalidateGetInsignificantVariantsForProjectById({ projectId: project.id });
      invalidateGetSignificantVariantsForProjectById({ projectId: project.id });
      toast.success(
        <Typography>
          {t("add_witness.add_witness_message", { name, siglum, projectName: project.name })}
        </Typography>,
      );
      handleCancel();
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.siglum) {
        toast.error(<Typography>{apiError.siglum}</Typography>);
        setError("siglum", {
          types: {
            message: apiError.siglum,
          },
        });
      }
    },
  });

  const registerSchema = zod.object({
    [FIELDS.NAME]: zod.string().max(50),
    [FIELDS.SIGLUM]: zod.string().min(1).max(2),
  });

  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddWitnessFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { current: witnessNameCurrent } = useCharacterLimit(watch(FIELDS.NAME));
  const { current: siglumCurrent } = useCharacterLimit(watch(FIELDS.SIGLUM));

  const apiError = unwrapAxiosError(axiosError);

  useEffect(() => {
    if (apiError) {
      setFormErrors({ apiError, fields: FIELDS, setError });
    }
  }, [setError, apiError]);

  return (
    <>
      <Button
        small={small}
        left={<PlusIcon />}
        disabled={disabled}
        variant={variant}
        onClick={toggleModalVisibility}
      >
        {t("add_witness.open_modal_button")}
      </Button>
      <Modal isOpen={isModalOpen} shouldCloseOnOverlayClick={true}>
        <Form
          onSubmit={handleSubmit(data => {
            addWitness({
              projectId: project.id,
              ...data,
            });
          })}
        >
          <Input
            type="text"
            label={t("add_witness.witness_name")}
            id={FIELDS.NAME}
            errorMessage={errors[FIELDS.NAME]?.message}
            {...register(FIELDS.NAME)}
            {...getFieldState(FIELDS.NAME)}
            current={witnessNameCurrent}
            maxLength={50}
          />
          <Input
            type="text"
            label={t("add_witness.siglum")}
            id={FIELDS.SIGLUM}
            disabled={isLoading}
            errorMessage={errors[FIELDS.SIGLUM]?.message}
            {...register(FIELDS.SIGLUM)}
            {...getFieldState(FIELDS.SIGLUM)}
            current={siglumCurrent}
            maxLength={2}
          />
          <ButtonWrapper>
            <StyledButton type="submit" disabled={isLoading} isLoading={isLoading}>
              {t("add_witness.submit")}
            </StyledButton>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {t("add_witness.cancel")}
            </Button>
          </ButtonWrapper>
        </Form>
      </Modal>
    </>
  );
}

export default AddWitnessButton;
