import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import Input from "@/components/input";
import InputEmail from "@/components/input-email";
import InputPassword from "@/components/input-password";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { passwordRules } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Error from "../error";
import { toast } from "../toast";
import Typography from "../typography";
import { useRegisterAccount } from "./query";

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export const { EMAIL, PASSWORD, CONFIRM_PASSWORD, NAME } = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  NAME: "name",
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

function RegisterAccountForm() {
  const { t } = useTranslation();

  const registerSchema = zod
    .object({
      [EMAIL]: zod.string().email(),
      [PASSWORD]: passwordRules("register_account."),
      [CONFIRM_PASSWORD]: passwordRules("register_account."),
      [NAME]: zod.string(),
    })
    .refine(
      data => {
        return data[PASSWORD] === data[CONFIRM_PASSWORD];
      },
      {
        message: t("register_account.password_no_match"),
        path: [CONFIRM_PASSWORD],
      },
    );

  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: registerAccount,
    error: rawError,
    isLoading,
  } = useRegisterAccount({
    onSuccess: () => {
      toast.success(<Typography>{t("register_account.success")}</Typography>);
    },
  });
  const apiError = unwrapAxiosError(rawError);

  const labels = {
    [EMAIL]: errors.email?.message || t("register_account.user_email"),
    [PASSWORD]: errors.password?.message || t("register_account.user_password"),
    [CONFIRM_PASSWORD]:
      errors.confirmPassword?.message || t("register_account.user_confirm_password"),
    [NAME]: t("register_account.user_name"),
  };

  return (
    <Form
      onSubmit={handleSubmit(({ confirmPassword, ...data }) =>
        registerAccount({
          user: {
            ...data,
            password_confirmation: confirmPassword,
          },
        }),
      )}
    >
      <InputEmail
        label={labels[EMAIL]}
        id={EMAIL}
        disabled={isLoading}
        {...register(EMAIL)}
        {...getFieldState(EMAIL)}
      />
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
      <Input
        type="text"
        autoComplete="name"
        label={labels[NAME]}
        id={NAME}
        disabled={isLoading}
        {...register(NAME)}
        {...getFieldState(NAME)}
      />
      <Error error={apiError} />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading}>
          {t("register_account.create_account")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default RegisterAccountForm;
