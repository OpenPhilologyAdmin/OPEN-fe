import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";
import { ROUTES } from "@/constants/routes";
import { setFormErrors } from "@/utils/set-form-errors";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import * as zod from "zod";

import InputEmail from "../input-email";
import { toast } from "../toast";
import Typography from "../typography";
import { useResendActivationEmail } from "./query";

export type ResendActivationEmailFormData = {
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
  display: grid;
  justify-content: left;
  grid-template-columns: auto auto;
  grid-column-gap: 24px;
`;

function ResendActivationEmailForm() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm<ResendActivationEmailFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: sendResendActivationEmailEmail,
    error: axiosError,
    isLoading,
  } = useResendActivationEmail({
    onSuccess: data => {
      const successMessage = data.data.message;

      if (successMessage) {
        toast.success(<Typography>{successMessage}</Typography>);
      }
    },
  });

  const apiError = unwrapAxiosError(axiosError);

  useEffect(() => {
    if (apiError) {
      setFormErrors({ apiError, fields: FIELDS, setError });
    }
  }, [setError, apiError]);

  return (
    <Form onSubmit={handleSubmit(data => sendResendActivationEmailEmail({ user: data }))}>
      <InputEmail
        label={t("resend_activation_email.user_email")}
        id={FIELDS.EMAIL}
        disabled={isLoading}
        errorMessage={errors[FIELDS.EMAIL]?.message}
        {...register(FIELDS.EMAIL)}
        {...getFieldState(FIELDS.EMAIL)}
      />
      <ButtonWrapper>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          {t("resend_activation_email.confirm")}
        </Button>
        <Button href={ROUTES.SIGN_IN()} variant="tertiary">
          {t("resend_activation_email.cancel")}
        </Button>
      </ButtonWrapper>
    </Form>
  );
}

export default ResendActivationEmailForm;
