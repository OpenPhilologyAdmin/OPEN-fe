import { forwardRef } from "react";

import EmailIcon from "@/assets/images/icons/at-email.svg";

import Input, { InputProps } from "../input";

type InputEmailProps = InputProps;

const InputEmail = forwardRef<HTMLInputElement, InputEmailProps>((props, ref) => {
  return (
    <Input
      type={"email"}
      autoComplete="email"
      {...props}
      ref={ref}
      left={<EmailIcon role="graphics-symbol" />}
    />
  );
});

InputEmail.displayName = "InputEmail";

export default InputEmail;
