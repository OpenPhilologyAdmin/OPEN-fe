import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import CheckmarkIcon from "@/assets/images/icons/check.svg";
import EditIcon from "@/assets/images/icons/edit-2.svg";
import Button from "@/components/ui/button";
import Input, { useCharacterLimit } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { ROUTES } from "@/constants/routes";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import { useInvalidateProjectListQuery } from "../query";
import { useUpdateProjectById } from "./query";

export type UpdateProjectByIdData = {
  name: string;
};

export type EditProjectNameFormProps = {
  name: string;
  id: number;
  onEdit: (id: number | null) => void;
};

export const FIELDS = {
  PROJECT_NAME: "name",
} as const;

const registerSchema = zod.object({
  [FIELDS.PROJECT_NAME]: zod.string().min(1).max(50),
});

const ButtonIconWithMarginLeft = styled(Button)`
  margin-left: 12px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 364px;
`;

function EditProjectNameForm({ name, id, onEdit }: EditProjectNameFormProps) {
  const [edit, setEdit] = useState(false);
  const { t } = useTranslation();
  const { invalidateProjectListQuery } = useInvalidateProjectListQuery();
  const {
    register,
    handleSubmit,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<UpdateProjectByIdData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name,
    },
  });
  const { mutate: updateProjectById, isLoading } = useUpdateProjectById({
    onSuccess: () => {
      toast.success(<Typography>{t("library.project_name_changed")}</Typography>);
      invalidateProjectListQuery();
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        if (apiError[FIELDS.PROJECT_NAME]) {
          toast.error(<Typography>{apiError[FIELDS.PROJECT_NAME]}</Typography>);
        }
      }
    },
  });

  const { current } = useCharacterLimit(watch(FIELDS.PROJECT_NAME));

  useEffect(() => {
    if (edit) {
      onEdit(id);
    }
  }, [edit, onEdit, id]);

  if (edit) {
    return (
      <Form
        onSubmit={handleSubmit(data => {
          updateProjectById({
            data: {
              project: { ...data },
            },
            id,
          });
          setEdit(false);
          onEdit(null);
        })}
      >
        <Input
          type="text"
          id={FIELDS.PROJECT_NAME}
          disabled={isLoading}
          errorMessage={errors[FIELDS.PROJECT_NAME]?.message}
          {...register(FIELDS.PROJECT_NAME)}
          {...getFieldState(FIELDS.PROJECT_NAME)}
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

  return (
    <>
      <Typography truncate>
        <Button variant="tertiary" href={ROUTES.LIBRARY()}>
          {name}
        </Button>
      </Typography>
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

export default EditProjectNameForm;
