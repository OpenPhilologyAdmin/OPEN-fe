declare namespace API {
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

  type ApiError = {
    message: string | string[];
  };
}
