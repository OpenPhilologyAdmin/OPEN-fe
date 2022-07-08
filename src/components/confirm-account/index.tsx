import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { ROUTES } from "@/constants/routes";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import Button from "../button";
import Typography from "../typography";
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
    mutate: confirmAccount,
    data,
    isLoading,
  } = useConfirmAccount({
    onSuccess: data => {
      toast.success(<Typography>{data.data.message}</Typography>);
      push(ROUTES.SIGN_IN());
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      setShowError(true);

      if (apiError && apiError[CONFIRM_ACCOUNT_TOKEN_KEY])
        toast.error(<Typography>{apiError[CONFIRM_ACCOUNT_TOKEN_KEY][0]}</Typography>, {
          toastId: "wrong_token",
        });
    },
  });

  useEffect(() => {
    if (confirmAccount) {
      confirmAccount({
        confirmation_token: confirmAccountToken,
      });
    }
  }, [confirmAccount, confirmAccountToken]);

  return (
    <Wrapper>
      <Typography>
        {showError ? t("confirm_account.unexpected_error") : data?.data.message}
      </Typography>

      <ButtonWrapper>
        <Button href={ROUTES.REGISTER_ACCOUNT()} disabled={isLoading} isLoading={isLoading}>
          {t("confirm_account.go_to_login")}
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default ConfirmAccount;
