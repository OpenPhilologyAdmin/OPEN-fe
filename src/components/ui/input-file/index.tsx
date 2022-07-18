import { forwardRef } from "react";

import UploadIcon from "@/assets/images/icons/upload.svg";
import styled from "styled-components";

import Typography from "../../ui/typography";
import Input, { getInputColor, InputProps } from "../input";

type InputFileProps = InputProps & {
  fileDisplayName?: string;
};

type FileNameProps = {
  disabled?: boolean;
};

const Wrapper = styled.label`
  position: relative;
`;

const FileName = styled(Typography)<FileNameProps>`
  position: absolute;
  top: 12px;
  left: 16px;
  max-width: 80%;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme, disabled }) => getInputColor({ theme, disabled })};
`;

/** Designed for usage as a controlled component */
const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ fileDisplayName, ...props }, ref) => {
    return (
      <Wrapper>
        <Input type={"file"} {...props} ref={ref} right={<UploadIcon role="graphics-symbol" />} />
        <FileName variant="body-regular" disabled={props.disabled} htmlFor={props.id}>
          {fileDisplayName}
        </FileName>
      </Wrapper>
    );
  },
);

InputFile.displayName = "InputFile";

export default InputFile;
export { Wrapper as InputFileWrapper };
