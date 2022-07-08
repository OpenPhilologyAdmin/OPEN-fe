import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import InputEmail from "../input-email";
import { toast } from "../toast";
import Typography from "../typography";
import { useResetPassword } from "./query";

export type ResetPasswordFormData = {
  email: string;
};

export const FIELDS = {
  EMAIL: "email",
} as const;

const registerSchema = zod.object({
  [FIELDS.EMAIL]: zod.string().email(),
});

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

function ResetPasswordForm() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: sendResetPasswordEmail,
    error: axiosError,
    isLoading,
  } = useResetPassword({
    onSuccess: data => {
      const successMessage = data.data.message || t("reset_password.success");

      toast.success(<Typography>{successMessage}</Typography>);
    },
  });

  const apiError = unwrapAxiosError(axiosError);

  useEffect(() => {
    if (apiError) {
      setFormErrors({ apiError, fields: FIELDS, setError });
    }
  }, [setError, apiError]);

  return (
    <Form onSubmit={handleSubmit(data => sendResetPasswordEmail({ user: data }))}>
      <InputEmail
        label={t("reset_password.user_email")}
        id={FIELDS.EMAIL}
        disabled={isLoading}
        errorMessage={errors[FIELDS.EMAIL]?.message}
        {...register(FIELDS.EMAIL)}
        {...getFieldState(FIELDS.EMAIL)}
      />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {t("reset_password.reset_password_button_text")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default ResetPasswordForm;
