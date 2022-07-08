import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import InputEmail from "@/components/input-email";
import InputPassword from "@/components/input-password";
import { toast } from "@/components/toast";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { passwordRules } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import Typography from "../typography";
import { useSignIn } from "./query";

export type RegisterFormData = {
  email: string;
  password: string;
};

export const FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
} as const;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
`;

const ButtonWrapper = styled.div`
  display: grid;
  justify-content: left;
  grid-template-columns: auto auto;
  grid-column-gap: 24px;
`;

function SignInForm() {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { setUser } = useUser();

  const registerSchema = zod.object({
    [FIELDS.EMAIL]: zod.string().email(),
    [FIELDS.PASSWORD]: passwordRules("sign_in."),
  });

  const {
    register,
    handleSubmit,
    getFieldState,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: signIn, isLoading } = useSignIn({
    onSuccess: ({ data: user }) => {
      setUser(user);
      push(ROUTES.HOME());
      toast.success(<Typography>{t("sign_in.success")}</Typography>);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) toast.error(<Typography>{apiError.error}</Typography>);
    },
  });

  return (
    <Form
      onSubmit={handleSubmit(data =>
        signIn({
          user: data,
        }),
      )}
    >
      <InputEmail
        label={t("sign_in.user_email")}
        id={FIELDS.EMAIL}
        disabled={isLoading}
        errorMessage={errors[FIELDS.EMAIL]?.message}
        {...register(FIELDS.EMAIL)}
        {...getFieldState(FIELDS.EMAIL)}
      />
      <InputPassword
        label={t("sign_in.user_password")}
        id={FIELDS.PASSWORD}
        disabled={isLoading}
        errorMessage={errors[FIELDS.PASSWORD]?.message}
        {...register(FIELDS.PASSWORD)}
        {...getFieldState(FIELDS.PASSWORD)}
      />

      <ButtonWrapper>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {t("sign_in.confirm")}
        </Button>
        <Button href={ROUTES.REGISTER_ACCOUNT()} variant="tertiary">
          {t("sign_in.create_account")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default SignInForm;
