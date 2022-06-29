import { toast, ToastContainer as BaseToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";

const ToastContainer = styled(BaseToastContainer)`
  &&&.Toastify__toast-container {
    top: 200px;
    width: 648px;

    .Toastify__toast-theme--light {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`;

function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      draggable={false}
    />
  );
}

export { ToastProvider, toast };
