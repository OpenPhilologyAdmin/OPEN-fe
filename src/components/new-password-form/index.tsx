import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import { NEW_PASSWORD_TOKEN_KEY } from "@/constants/reset-password-token";
import { ROUTES } from "@/constants/routes";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { passwordRules } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import InputPassword from "../input-password";
import Typography from "../typography";
import { useNewPassword } from "./query";

type NewPasswordFormProps = {
  newPasswordToken: string;
};

export type NewPasswordFormData = {
  password: string;
  password_confirmation: string;
};

export const FIELDS = {
  PASSWORD: "password",
  CONFIRM_PASSWORD: "password_confirmation",
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

function NewPasswordForm({ newPasswordToken }: NewPasswordFormProps) {
  const { t } = useTranslation();
  const { push } = useRouter();

  const registerSchema = zod
    .object({
      [FIELDS.PASSWORD]: passwordRules("new_password."),
      [FIELDS.CONFIRM_PASSWORD]: passwordRules("new_password."),
    })
    .refine(
      data => {
        return data[FIELDS.PASSWORD] === data[FIELDS.CONFIRM_PASSWORD];
      },
      {
        message: t("new_password.password_no_match"),
        path: [FIELDS.CONFIRM_PASSWORD],
      },
    );

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: setNewPassword,
    error: axiosError,
    isLoading,
  } = useNewPassword({
    onSuccess: data => {
      const successMessage = data.data.message || t("reset_password.success");

      push(ROUTES.HOME());
      toast.success(<Typography>{successMessage}</Typography>);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError && apiError[NEW_PASSWORD_TOKEN_KEY])
        toast.error(<Typography>{apiError[NEW_PASSWORD_TOKEN_KEY][0]}</Typography>);
    },
  });

  const apiError = unwrapAxiosError(axiosError);

  useEffect(() => {
    if (apiError) {
      setFormErrors({ apiError, fields: FIELDS, setError });
    }
  }, [setError, apiError]);

  return (
    <Form
      onSubmit={handleSubmit(data => {
        setNewPassword({
          reset_password_token: newPasswordToken,
          ...data,
        });
      })}
    >
      <InputPassword
        label={t("new_password.user_password")}
        id={FIELDS.PASSWORD}
        disabled={isLoading}
        errorMessage={errors[FIELDS.PASSWORD]?.message}
        {...register(FIELDS.PASSWORD)}
        {...getFieldState(FIELDS.PASSWORD)}
      />
      <InputPassword
        label={t("new_password.user_confirm_password")}
        id={FIELDS.CONFIRM_PASSWORD}
        disabled={isLoading}
        errorMessage={errors[FIELDS.CONFIRM_PASSWORD]?.message}
        {...register(FIELDS.CONFIRM_PASSWORD)}
        {...getFieldState(FIELDS.CONFIRM_PASSWORD)}
      />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading}>
          {t("new_password.save_and_sign_in")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default NewPasswordForm;
