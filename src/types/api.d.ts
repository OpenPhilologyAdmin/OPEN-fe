declare namespace API {
  type ProjectStatus = "processing" | "processed" | "invalid";

  type User = {
    id: number;
    email: string;
    name: string;
    account_approved: boolean;
    registration_date: string;
    role: "admin";
  };

  type Witness = {
    id: string;
    name: string;
    siglum: string;
    default: false;
  };

  type Project = {
    id: number;
    name: string;
    default_witness: string;
    witnesses: Witness[];
    witnesses_count: 0;
    status: ProjectStatus;
    created_by: string;
    creation_date: string;
    last_edit_date: string;
  };

  type Error = {
    [key: ?string]: string[];
    error?: string | string[];
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

  type ImportFilePayload = {
    project: {
      name: string;
      source_file: {
        data: string;
      };
      default_witness: string;
      default_witness_name: string;
    };
  };

  type ImportFileResponse = Project;

  type GetProjectByIdResponse = Project;
}
