import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import Input from "@/components/input";
import InputEmail from "@/components/input-email";
import InputPassword from "@/components/input-password";
import { toast } from "@/components/toast";
import { ROUTES } from "@/constants/routes";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { passwordRules } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Typography from "../typography";
import { useRegisterAccount } from "./query";

export type RegisterFormData = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
};

export const FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "password_confirmation",
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
  const { push } = useRouter();

  const registerSchema = zod
    .object({
      [FIELDS.EMAIL]: zod.string().email(),
      [FIELDS.PASSWORD]: passwordRules("register_account."),
      [FIELDS.CONFIRM_PASSWORD]: passwordRules("register_account."),
      [FIELDS.NAME]: zod.string().min(1, t("register_account.name_required")),
    })
    .refine(
      data => {
        return data[FIELDS.PASSWORD] === data[FIELDS.CONFIRM_PASSWORD];
      },
      {
        message: t("register_account.password_no_match"),
        path: [FIELDS.CONFIRM_PASSWORD],
      },
    );

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: registerAccount,
    error: axiosError,
    isLoading,
  } = useRegisterAccount({
    onSuccess: () => {
      toast.success(<Typography>{t("register_account.success")}</Typography>);
      push(ROUTES.SIGN_IN());
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
      onSubmit={handleSubmit(data =>
        registerAccount({
          user: data,
        }),
      )}
    >
      <InputEmail
        label={t("register_account.user_email")}
        id={FIELDS.EMAIL}
        disabled={isLoading}
        errorMessage={errors[FIELDS.EMAIL]?.message}
        {...register(FIELDS.EMAIL)}
        {...getFieldState(FIELDS.EMAIL)}
      />
      <InputPassword
        label={t("register_account.user_password")}
        id={FIELDS.PASSWORD}
        disabled={isLoading}
        errorMessage={errors[FIELDS.PASSWORD]?.message}
        {...register(FIELDS.PASSWORD)}
        {...getFieldState(FIELDS.PASSWORD)}
      />
      <InputPassword
        label={t("register_account.user_confirm_password")}
        id={FIELDS.CONFIRM_PASSWORD}
        disabled={isLoading}
        errorMessage={errors[FIELDS.CONFIRM_PASSWORD]?.message}
        {...register(FIELDS.CONFIRM_PASSWORD)}
        {...getFieldState(FIELDS.CONFIRM_PASSWORD)}
      />
      <Input
        type="text"
        autoComplete="name"
        label={t("register_account.user_name")}
        id={FIELDS.NAME}
        disabled={isLoading}
        errorMessage={errors[FIELDS.NAME]?.message}
        {...register(FIELDS.NAME)}
        {...getFieldState(FIELDS.NAME)}
      />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading}>
          {t("register_account.create_account")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default RegisterAccountForm;
