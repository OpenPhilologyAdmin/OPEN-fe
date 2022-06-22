import { forwardRef, useState } from "react";
import { useTranslation } from "next-i18next";

import BaseEyeClosedIcon from "@/assets/images/icons/eye-closed.svg";
import BaseEyeOpenIcon from "@/assets/images/icons/eye-open.svg";
import styled, { css } from "styled-components";

import Input, { InputProps } from "../input";

type InputPasswordProps = InputProps;

const iconStyles = css`
  cursor: pointer;
`;

const EyeClosedIcon = styled(BaseEyeClosedIcon)`
  ${iconStyles};
`;

const EyeOpenIcon = styled(BaseEyeOpenIcon)`
  ${iconStyles};
`;

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleSetIsPasswordVisible = () => setIsPasswordVisible(previousState => !previousState);

  return (
    <Input
      type={isPasswordVisible ? "text" : "password"}
      autoComplete="new-password"
      // TODO replace `left` content with ButtonIcon in OPLU-124
      left={
        isPasswordVisible ? (
          <EyeClosedIcon
            role="button"
            aria-label={t("a11y.hide_password")}
            onClick={toggleSetIsPasswordVisible}
          />
        ) : (
          <EyeOpenIcon
            role="button"
            aria-label={t("a11y.show_password")}
            onClick={toggleSetIsPasswordVisible}
          />
        )
      }
      {...props}
      ref={ref}
    />
  );
});

InputPassword.displayName = "InputPassword";

export default InputPassword;
