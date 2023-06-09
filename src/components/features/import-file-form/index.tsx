import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { fileToBase64 } from "@/utils/file-to-base-64";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Input, { useCharacterLimit } from "../../ui/input";
import InputFile from "../../ui/input-file";
import { toast } from "../../ui/toast";
import Typography from "../../ui/typography";
import { useGetProjectById, useImportFile } from "./query";

export type ImportFileState = {
  file: File | null;
  error?: string;
};

export type NewPasswordFormData = {
  name: string;
  default_witness_name: string;
  default_witness: string;
};

export const ALLOWED_MIME_TYPES = {
  JSON: "application/json",
};

const FILE_INPUT = {
  ID: "file_input_id",
  ACCEPT_ATTRIBUTE_VALUE: `${ALLOWED_MIME_TYPES.JSON}`,
};

export const FIELDS = {
  DOCUMENT_NAME: "name",
  WITNESS_NAME: "default_witness_name",
  SIGLUM: "default_witness",
} as const;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

/** File upload input is used as a controlled component because based on it's value,
 * other fields are rendered conditionally before the form is submitted.
 * The value of the field for uncontrolled, could be read only on submit, thus the approach.
 * Other form fields are uncontrolled components as per usual in this app.
 */
function ImportFileForm() {
  const { t } = useTranslation();
  const [fileState, setFileState] = useState<ImportFileState>({
    file: null,
  });
  const { push } = useRouter();
  const [isPolling, setIsPolling] = useState(false);
  /**
   * Source: OPLU-338
   * Importing the text files is temporarily disabled.
   * Replace "text/plain" in the line below with ALLOWED_MIME_TYPES.TXT once TXT files are enabled.
   */
  const showExtraFieldsForTxtFiles = fileState.file?.type === "text/plain";
  const fileName = fileState.file?.name;

  const registerSchema = zod.object({
    [FIELDS.DOCUMENT_NAME]: zod.string().min(1).max(50),
    ...(showExtraFieldsForTxtFiles && {
      [FIELDS.WITNESS_NAME]: zod.string().max(50),
      [FIELDS.SIGLUM]: zod.string().min(1).max(2),
    }),
  });

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { current: documentNameCurrent } = useCharacterLimit(watch(FIELDS.DOCUMENT_NAME));
  const { current: witnessNameCurrent } = useCharacterLimit(watch(FIELDS.WITNESS_NAME));
  const { current: siglumCurrent } = useCharacterLimit(watch(FIELDS.SIGLUM));

  const {
    data: importFileResponse,
    mutate: importFile,
    error: importFileAxiosError,
    isLoading: importFileIsLoading,
  } = useImportFile({
    onSuccess: () => {
      setIsPolling(true);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) {
        toast.error(<Typography>{apiError.error}</Typography>);
      }
    },
  });

  const isLoading = importFileIsLoading || isPolling;

  const { data: project } = useGetProjectById({
    id: importFileResponse?.data.id,
    isPolling,
    options: {
      onError: axiosError => {
        const apiError = unwrapAxiosError(axiosError);

        if (apiError?.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }
      },
      onSuccess: data => {
        const { status, id, import_errors } = data.data;

        if (status === "processed") {
          toast.success(
            <Typography>{t("import_file.processing_success", { fileName })}</Typography>,
          );

          push(ROUTES.WITNESS_LIST(id));
        }

        const errorsArray = Object.values(import_errors).flat();

        if (status === "invalid") {
          if (errorsArray.length > 0) {
            toast.error(
              <>
                {errorsArray.map(error => (
                  <div key={error}>
                    <Typography>{error}</Typography>
                  </div>
                ))}
              </>,
            );
          } else {
            toast.error(<Typography>{t("import_file.processing_error", { fileName })}</Typography>);
          }
        }
      },
    },
  });

  const importFileApiError = unwrapAxiosError(importFileAxiosError);
  const importedFileStatus = project?.status;

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && Object.values(ALLOWED_MIME_TYPES).includes(file.type)) {
      setFileState({ file });
    } else {
      setFileState({ error: t("import_file.file_format_error"), file: null });
    }
  };

  useEffect(() => {
    if (importedFileStatus && importedFileStatus !== "processing") {
      setIsPolling(false);
    }
  }, [importedFileStatus]);

  useEffect(() => {
    if (importFileApiError) {
      setFormErrors({ apiError: importFileApiError, fields: FIELDS, setError });
    }
  }, [setError, importFileApiError]);

  return (
    <Form
      onSubmit={handleSubmit(async data => {
        if (fileState.file) {
          const base64FileString = await fileToBase64(fileState.file);

          if (typeof base64FileString === "string") {
            importFile({
              project: {
                ...data,
                source_file: { data: base64FileString },
              },
            });
          } else {
            setFileState({ file: null, error: t("import_file.file_error_select") });
          }
        } else {
          setFileState({ file: null, error: t("import_file.file_error_select") });
        }
      })}
    >
      <InputFile
        label={t("import_file.file_name")}
        id={FILE_INPUT.ID}
        errorMessage={fileState.error}
        disabled={isLoading}
        fileDisplayName={fileName}
        invalid={!!fileState.error}
        onChange={handleFileSelect}
        accept={FILE_INPUT.ACCEPT_ATTRIBUTE_VALUE}
      />
      <Input
        type="text"
        label={t("import_file.document_name")}
        id={FIELDS.DOCUMENT_NAME}
        disabled={isLoading}
        errorMessage={errors[FIELDS.DOCUMENT_NAME]?.message}
        {...register(FIELDS.DOCUMENT_NAME)}
        {...getFieldState(FIELDS.DOCUMENT_NAME)}
        current={documentNameCurrent}
        maxLength={50}
      />
      {showExtraFieldsForTxtFiles && (
        <>
          <Input
            type="text"
            label={t("import_file.witness_name")}
            id={FIELDS.WITNESS_NAME}
            disabled={isLoading}
            errorMessage={errors[FIELDS.WITNESS_NAME]?.message}
            {...register(FIELDS.WITNESS_NAME)}
            {...getFieldState(FIELDS.WITNESS_NAME)}
            current={witnessNameCurrent}
            maxLength={50}
          />
          <Input
            type="text"
            label={t("import_file.siglum")}
            id={FIELDS.SIGLUM}
            disabled={isLoading}
            errorMessage={errors[FIELDS.SIGLUM]?.message}
            {...register(FIELDS.SIGLUM)}
            {...getFieldState(FIELDS.SIGLUM)}
            current={siglumCurrent}
            maxLength={2}
          />
        </>
      )}

      <ButtonWrapper>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {isLoading ? t("import_file.processing_file") : t("import_file.process_file")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default ImportFileForm;
