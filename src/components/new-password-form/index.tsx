import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import { resetPasswordTokenKey } from "@/constants/reset-password-token";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { passwordRules } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Error from "../error";
import InputPassword from "../input-password";
import Typography from "../typography";
import { useNewPassword } from "./query";

export const { PASSWORD, CONFIRM_PASSWORD } = {
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
} as const;

export type NewPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

function NewPasswordForm() {
  const { t } = useTranslation();
  const {
    query: { [resetPasswordTokenKey]: resetPasswordToken },
  } = useRouter();

  const registerSchema = zod
    .object({
      [PASSWORD]: passwordRules("new_password."),
      [CONFIRM_PASSWORD]: passwordRules("new_password."),
    })
    .refine(
      data => {
        return data[PASSWORD] === data[CONFIRM_PASSWORD];
      },
      {
        message: t("new_password.password_no_match"),
        path: [CONFIRM_PASSWORD],
      },
    );

  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(registerSchema),
  });

  const labels = {
    [PASSWORD]: errors.password?.message || t("new_password.user_password"),
    [CONFIRM_PASSWORD]: errors.confirmPassword?.message || t("new_password.user_confirm_password"),
  };

  const { mutate: setNewPassword, data, error: rawError, isLoading, isSuccess } = useNewPassword();

  const apiError = unwrapAxiosError(rawError);
  const successMessage = data?.data.message || t("reset_password.success");

  return (
    <Form
      onSubmit={handleSubmit(({ password, confirmPassword }) => {
        if (typeof resetPasswordToken === "string" && resetPasswordToken.length > 0) {
          setNewPassword({
            reset_password_token: resetPasswordToken,
            password,
            password_confirmation: confirmPassword,
          });
        }
      })}
    >
      <InputPassword
        label={labels[PASSWORD]}
        id={PASSWORD}
        disabled={isLoading}
        {...register(PASSWORD)}
        {...getFieldState(PASSWORD)}
      />
      <InputPassword
        label={labels[CONFIRM_PASSWORD]}
        id={CONFIRM_PASSWORD}
        disabled={isLoading}
        {...register(CONFIRM_PASSWORD)}
        {...getFieldState(CONFIRM_PASSWORD)}
      />
      <Error error={apiError} />
      {/* TODO replace with a toast when global toast setup is done */}
      {isSuccess && <Typography>{successMessage}</Typography>}
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading}>
          {t("new_password.save_and_sign_in")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default NewPasswordForm;
