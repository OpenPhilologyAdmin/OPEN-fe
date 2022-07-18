import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { ROUTES } from "@/constants/routes";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import Button from "../../ui/button";
import Typography from "../../ui/typography";
import { useConfirmAccount } from "./query";

type ConfirmAccountProps = {
  confirmAccountToken: string;
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

function ConfirmAccount({ confirmAccountToken }: ConfirmAccountProps) {
  const { t } = useTranslation();
  const { push } = useRouter();
  const [showError, setShowError] = useState(false);
  const {
    data,
    isLoading,
    error: axiosError,
    isError,
    isSuccess,
  } = useConfirmAccount({
    confirmation_token: confirmAccountToken,
  });

  useEffect(() => {
    if (isSuccess && data) {
      push(ROUTES.SIGN_IN());
      toast.success(<Typography>{data.message}</Typography>);
    }
  }, [isSuccess, data, push]);

  useEffect(() => {
    if (isError && axiosError) {
      const apiError = unwrapAxiosError(axiosError);

      if (!showError) setShowError(true);

      if (apiError && apiError[CONFIRM_ACCOUNT_TOKEN_KEY])
        toast.error(<Typography>{apiError[CONFIRM_ACCOUNT_TOKEN_KEY][0]}</Typography>, {
          toastId: "wrong_token",
        });
    }
  }, [isError, axiosError, showError]);

  return (
    <Wrapper>
      <Typography>{showError ? t("confirm_account.unexpected_error") : data?.message}</Typography>

      <ButtonWrapper>
        <Button href={ROUTES.REGISTER_ACCOUNT()} disabled={isLoading}>
          {t("confirm_account.go_to_login")}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default ConfirmAccount;
