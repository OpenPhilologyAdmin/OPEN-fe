declare namespace API {
  type User = {
    id: number;
    email: string;
    name: string;
    account_approved: boolean;
    role: "admin";
  };

  type SignInPayload = {
    user: {
      email: string;
      password: string;
    };
  };

  type SignInResponse = User;

  type RegisterAccountPayload = {
    user: {
      email: string;
      password: string;
      password_confirmation: string;
      name: string;
    };
  };

  type RegisterAccountResponse = User;

  type ResetPasswordPayload = {
    user: {
      email: string;
    };
  };

  type ResetPasswordResponse = {
    message: string;
  };

  type NewPasswordPayload = {
    reset_password_token: string;
    password: string;
    password_confirmation: string;
  };

  type NewPasswordResponse = {
    message: string;
  };

  type SignOutResponse = {
    message: string;
  };

  type RefreshTokenResponse = {
    message: string;
  };

  type ResendActivationEmailPayload = {
    user: {
      email: string;
    };
  };

  type ResendActivationEmailResponse = {
    message: string;
  };

  type ConfirmAccountPayload = {
    confirmation_token: string;
  };

  type ConfirmAccountResponse = {
    message: string;
  };

  type GetUserListResponse = {
    records: User[];
    count: number;
  };

  type ApproveUserByIdPayload = {
    id: number;
  };

  type ApproveUserByIdResponse = User;

  type MeResponse = User;

  type Error = {
    [key: ?string]: string[];
    error?: string | string[];
  };
}
