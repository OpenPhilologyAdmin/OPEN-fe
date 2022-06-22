import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Error from "../error";
import InputEmail from "../input-email";
import Typography from "../typography";
import { useResetPassword } from "./query";

export const { EMAIL } = {
  EMAIL: "email",
} as const;

export type ResetPasswordFormData = {
  email: string;
};

const registerSchema = zod.object({
  [EMAIL]: zod.string().email(),
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
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(registerSchema),
  });

  const labels = {
    [EMAIL]: errors.email?.message || t("reset_password.user_email"),
  };

  const {
    mutate: sendResetPasswordEmail,
    data,
    error: rawError,
    isLoading,
    isSuccess,
  } = useResetPassword();

  const apiError = unwrapAxiosError(rawError);
  const successMessage = data?.data.message || t("reset_password.success");

  return (
    <Form onSubmit={handleSubmit(({ email }) => sendResetPasswordEmail({ user: { email } }))}>
      <InputEmail
        label={labels[EMAIL]}
        id={EMAIL}
        disabled={isLoading}
        {...register(EMAIL)}
        {...getFieldState(EMAIL)}
      />
      <Error error={apiError} />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading}>
          {t("reset_password.reset_password_button_text")}
        </Button>
      </ButtonWrapper>
      {/* TODO replace with a toast when global toast setup is done */}
      {isSuccess && <Typography>{successMessage}</Typography>}
    </Form>
  );
}

export default ResetPasswordForm;
