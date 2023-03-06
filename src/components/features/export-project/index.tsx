import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import DownloadIcon from "@/assets/images/icons/download.svg";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import Modal, { useModal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import NewTypography from "@/components/ui/typography/new_index";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useExportProjectById } from "./query";

export type ExportFormProps = {
  disabled?: boolean;
  variant?: "primary" | "secondary";
  projectId: number;
  projectName: string;
};

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
  height: 100%;
  align-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

const ApparatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: baseline;
`;

const InputWrapper = styled.div`
  width: 48px;
`;

const SeparatorErrorWrapper = styled.div`
  display: flex;
  width: 100%;
  color: ${({ theme }) => theme.colors.error};
`;

export type ExportProjectByIdFormData = {
  significant_readings: boolean;
  insignificant_readings: boolean;
  footnote_numbering: boolean;
  selected_reading_separator: string;
  readings_separator: string;
  sigla_separator: string;
};

export const FIELDS = {
  INCLUDES_SIGNIFICANT_VARIANTS: "significant_readings",
  INCLUDES_INSIGNIFICANT_VARIANTS: "insignificant_readings",
  INCLUDES_FOOTNOTE_NUMBERING: "footnote_numbering",
  SIGLA: "readings_separator",
  LEMMA: "selected_reading_separator",
  REJECTED_SIGLA: "sigla_separator",
} as const;

const OUTPUT_EXAMPLE = "Lemma ] Aa Bb Cc; Dd: rejected reading 1; Ee: rejected reading 2";

function ExportProject({
  disabled = false,
  variant = "primary",
  projectId,
  projectName,
}: ExportFormProps) {
  const { t } = useTranslation();
  const { isOpen: isModalOpen, toggleModalVisibility } = useModal();
  const handleCancel = () => {
    toggleModalVisibility();
    reset();
  };

  const {
    mutate: exportProjectById,
    isLoading,
    error: axiosErrorAsBlob,
  } = useExportProjectById({
    onSuccess: ({ data }) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(data);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${projectName}.rtf`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link?.parentNode?.removeChild(link);
      toast.success(
        <NewTypography>{t("project.export_file_message", { projectName })}</NewTypography>,
      );
      handleCancel();
      reset();
    },
    onError: async axiosErrorAsBlob => {
      if (axiosErrorAsBlob) {
        toast.error(<NewTypography>{t("project.export_failure")}</NewTypography>);
      }
    },
  });

  const {
    handleSubmit,
    register,
    getFieldState,
    formState: { errors },
    setError,
    reset,
  } = useForm<ExportProjectByIdFormData>();

  useEffect(() => {
    if (axiosErrorAsBlob) {
      async function setFormErrorsFromBlob() {
        // Api returns blob with error message
        const apiErrorAsBlob = unwrapAxiosError(axiosErrorAsBlob) as unknown as Blob;

        if (apiErrorAsBlob instanceof Blob) {
          const apiErrorAsText = await apiErrorAsBlob?.text();
          const apiError = JSON.parse(apiErrorAsText);

          if (apiError) {
            setFormErrors({ apiError, fields: FIELDS, setError });
          }
        }
      }

      setFormErrorsFromBlob();
    }
  }, [axiosErrorAsBlob, setError]);

  const stringFieldErrorMessages =
    errors[FIELDS.LEMMA]?.message ||
    errors[FIELDS.SIGLA]?.message ||
    errors[FIELDS.REJECTED_SIGLA]?.message;

  return (
    <>
      <Button
        small
        left={<DownloadIcon />}
        disabled={disabled}
        variant={variant}
        onClick={toggleModalVisibility}
      >
        {t("project.export_button")}
      </Button>
      <Modal
        isOpen={isModalOpen}
        style={{
          content: {
            inset: `calc(50% - ${stringFieldErrorMessages ? 280 : 280 - 24}px) calc(50% - 400px)`,
          },
        }}
        shouldCloseOnOverlayClick={true}
      >
        <Form
          onSubmit={handleSubmit(data => {
            exportProjectById({
              projectId,
              data: {
                project: {
                  ...data,
                },
              },
            });
          })}
        >
          <NewTypography bold>{t("project.export_label")}</NewTypography>
          <Checkbox
            {...register(FIELDS.INCLUDES_SIGNIFICANT_VARIANTS)}
            {...getFieldState(FIELDS.INCLUDES_SIGNIFICANT_VARIANTS)}
            label={t("project.export_include_significant_variants")}
            id={FIELDS.INCLUDES_SIGNIFICANT_VARIANTS}
          />
          <Checkbox
            {...register(FIELDS.INCLUDES_INSIGNIFICANT_VARIANTS)}
            {...getFieldState(FIELDS.INCLUDES_INSIGNIFICANT_VARIANTS)}
            label={t("project.export_include_insignificant_variants")}
            id={FIELDS.INCLUDES_INSIGNIFICANT_VARIANTS}
          />
          <Checkbox
            {...register(FIELDS.INCLUDES_FOOTNOTE_NUMBERING)}
            {...getFieldState(FIELDS.INCLUDES_FOOTNOTE_NUMBERING)}
            label={t("project.export_include_footnote_numbering")}
            id={FIELDS.INCLUDES_FOOTNOTE_NUMBERING}
          />
          <NewTypography bold>{t("project.export_apparatus_label")}</NewTypography>
          <ApparatusWrapper>
            <NewTypography>{t("project.export_lemma")}</NewTypography>
            <InputWrapper>
              <Input
                data-testid="lemma"
                id={FIELDS.LEMMA}
                {...register(FIELDS.LEMMA)}
                {...getFieldState(FIELDS.LEMMA)}
              />
            </InputWrapper>
            <NewTypography>{t("project.export_sigla")}</NewTypography>
            <InputWrapper>
              <Input
                data-testid="sigla"
                id={FIELDS.SIGLA}
                {...register(FIELDS.SIGLA)}
                {...getFieldState(FIELDS.SIGLA)}
              />
            </InputWrapper>
            <NewTypography>{t("project.sigla_of_rejected_reading")}</NewTypography>
            <InputWrapper>
              <Input
                data-testid="rejectedSigla"
                id={FIELDS.REJECTED_SIGLA}
                {...register(FIELDS.REJECTED_SIGLA)}
                {...getFieldState(FIELDS.REJECTED_SIGLA)}
              />
            </InputWrapper>
            <NewTypography>{t("project.rejected_reading")}</NewTypography>
          </ApparatusWrapper>
          {stringFieldErrorMessages && (
            <SeparatorErrorWrapper>
              <NewTypography>{stringFieldErrorMessages}</NewTypography>
            </SeparatorErrorWrapper>
          )}
          <NewTypography>
            <NewTypography bold>{t("project.export_example_prefix")}</NewTypography>
            {OUTPUT_EXAMPLE}
          </NewTypography>
          <ButtonWrapper>
            <StyledButton type="submit" disabled={isLoading} isLoading={isLoading}>
              {t("project.export_submit")}
            </StyledButton>
            <Button variant="secondary" type="button" onClick={handleCancel} disabled={isLoading}>
              {t("project.cancel")}
            </Button>
          </ButtonWrapper>
        </Form>
      </Modal>
    </>
  );
}

export default ExportProject;
