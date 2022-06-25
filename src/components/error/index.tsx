import styled from "styled-components";

import Typography from "../typography";

/** Temporary component, will be removed or modified and tested
 *  after we agree on how to display backend errors
 */

type ErrorProps = {
  error?: API.ApiError;
};

const ErrorMessage = styled(Typography).attrs({ variant: "body-regular" })`
  color: ${({ theme }) => theme.colors.error};
`;

function Error({ error }: ErrorProps) {
  if (!error?.error) return null;

  const { error: message } = error;

  if (typeof message === "string") return <ErrorMessage>{message}</ErrorMessage>;

  if (message.length > 0) {
    return (
      <>
        {message.map(singleMessage => (
          <ErrorMessage key={singleMessage}>{singleMessage}</ErrorMessage>
        ))}
      </>
    );
  }

  return null;
}

export default Error;
