import { forwardRef, useState } from "react";
import { useTranslation } from "next-i18next";

import EyeClosedIcon from "@/assets/images/icons/eye-closed.svg";
import EyeOpenIcon from "@/assets/images/icons/eye-open.svg";
import styled from "styled-components";

import Input, { InputProps } from "../input";

type InputPasswordProps = InputProps;

const Button = styled.button`
  z-index: 1;
  height: 24px;
  margin: 0;
  border: 0;
  padding: 0;
  line-height: 24px;
  background-color: transparent;
  cursor: pointer;

  :focus {
    outline: none;
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${({ theme: { colors } }) => colors.focusShadow};
  }
`;

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleSetIsPasswordVisible = () => setIsPasswordVisible(previousState => !previousState);

  return (
    <Input
      type={isPasswordVisible ? "text" : "password"}
      autoComplete="new-password"
      left={
        isPasswordVisible ? (
          <Button
            type="button"
            onClick={toggleSetIsPasswordVisible}
            aria-label={t("a11y.hide_password")}
          >
            <EyeClosedIcon />
          </Button>
        ) : (
          <Button
            type="button"
            aria-label={t("a11y.show_password")}
            onClick={toggleSetIsPasswordVisible}
          >
            <EyeOpenIcon />
          </Button>
        )
      }
      {...props}
      ref={ref}
    />
  );
});

InputPassword.displayName = "InputPassword";

export default InputPassword;
