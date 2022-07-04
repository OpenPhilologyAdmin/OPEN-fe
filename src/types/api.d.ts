declare namespace API {
  type SignInPayload = {
    user: {
      email: string;
      password: string;
    };
  };

  type SignInResponse = {
    id: number;
    email: string;
    name: string;
    account_approved: boolean;
    role: "admin";
  };

  type RegisterAccountPayload = {
    user: {
      email: string;
      password: string;
      password_confirmation: string;
      name: string;
    };
  };

  type RegisterAccountResponse = {
    id: number;
    email: string;
    name: string;
    account_approved: boolean;
    role: "admin";
  };

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

  type Error = {
    [key: ?string]: string[];
    error?: string | string[];
  };
}
