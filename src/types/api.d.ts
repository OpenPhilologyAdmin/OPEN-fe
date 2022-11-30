declare namespace API {
  type EditorialRemarkType = "st." | "corr." | "em." | "conj.";
  type ProjectStatus = "processing" | "processed" | "invalid";
  type TokenState =
    | "one_variant"
    | "not_evaluated"
    | "evaluated_with_single"
    | "evaluated_with_multiple";

  type User = {
    id: number;
    email: string;
    name: string;
    account_approved: boolean;
    registration_date: string;
    role: "admin";
    last_edited_project_id: number | null;
  };

  type Witness = {
    id: string;
    name: string | null;
    siglum: string;
    default: boolean;
  };

  type Project = {
    id: number;
    name: string;
    default_witness: string;
    witnesses: Witness[];
    witnesses_count: 0;
    status: ProjectStatus;
    created_by: string;
    creator_id: number;
    creation_date: string;
    last_edit_by?: string;
    last_edit_date: string;
    import_errors: {
      [key: string]: string[];
    };
  };

  type GroupedVariant = {
    id: string;
    witnesses: string[];
    t: string;
    selected: boolean;
    possible: boolean;
  };

  type Variant = {
    witness: string;
    t: string;
  };

  type Token = {
    id: number;
    t: string;
    apparatus_index: number;
    state: TokenState;
  };

  type EditorialRemark = {
    type: EditorialRemarkType;
    t: string;
  };

  type TokenDetails = {
    id: number;
    apparatus: {
      selected_reading: string;
      details: string;
    } | null;
    grouped_variants: GroupedVariant[];
    variants: Variant[];
    editorial_remark: EditorialRemark;
  };

  type TokenWithOffset = {
    offset?: number;
    token_id: number;
  };

  type SignificantVariant = {
    token_id: number;
    index: number;
    value: {
      details: string;
      selected_reading: string;
    };
  };

  type InsignificantVariant = {
    token_id: number;
    index: number;
    value: {
      details: string;
      selected_reading: string;
    };
  };

  type Comment = {
    id: number;
    body: string;
    token_id: number;
    user_id: number;
    created_at: string;
    created_by: string;
    last_edit_at: string;
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

  type GetProjectListResponse = {
    records: Project[];
    count: number;
  };

  type DeleteProjectByIdPayload = {
    id: number;
  };

  type DeleteCommentByIdPayload = {
    projectId: number;
    tokenId: number | null;
    commentId: number;
  };

  type DeleteCommentByIdResponse = {
    message: string;
  };

  type EditCommentByIdResponse = {
    message: string;
  };

  type DeleteProjectByIdResponse = {
    message: string;
  };

  type UpdateProjectByIdPayload = {
    project: {
      name: string;
    };
  };

  type UpdateProjectByIdResponse = Project;

  type GetWitnessListByProjectIdResponse = {
    records: Witness[];
    count: number;
  };

  type UpdateWitnessByIdPayload = {
    witness: {
      name: string | null;
      default?: boolean;
    };
  };

  type UpdateWitnessByIdResponse = {
    witness: Witness;
  };

  type DeleteWitnessByIdPayload = {
    projectId: number;
    witnessId: string;
  };

  type DeleteWitnessByIdResponse = {
    message: string;
  };

  type AddCommentPayload = {
    projectId: number;
    tokenId: number | null;
    body: string;
  };

  type AddCommentResponse = {
    message: string;
  };

  type AddWitnessPayload = {
    projectId: number;
    name: string;
    siglum: string;
  };

  type EditCommentByIdPayload = {
    projectId: number;
    tokenId: number | null;
    commentId: number;
    body: string;
  };

  type AddWitnessResponse = {
    name: string;
    siglum: string;
  };

  type GetTokensForProjectByIdResponse = {
    records: Token[];
    count: number;
  };

  type GetCommentsForProjectByIdResponse = Comment[];

  type GetSignificantVariantsForProjectByIdResponse = {
    records: SignificantVariant[];
    count: number;
  };

  type GetInsignificantVariantsForProjectByIdResponse = {
    records: InsignificantVariant[];
    count: number;
  };

  type GetTokenDetailsForProjectByIdResponse = TokenDetails;

  type UpdateGroupedVariantsForTokenByIdPayload = {
    token: {
      grouped_variants: Pick<GroupedVariant, "id" | "possible" | "selected">[];
    };
  };

  type UpdateGroupedVariantsForTokenByIdResponse = TokenDetails;

  type UpdateVariantsForTokenByIdPayload = {
    token: {
      variants: Variant[];
      editorial_remark?: {
        type: EditorialRemarkType;
        t: string;
      };
    };
  };

  type UpdateVariantsForTokenByIdResponse = TokenDetails;

  type GetEditorialRemarksResponse = {
    Standardisation: "st.";
    Correction: "corr.";
    Emendation: "em.";
    Conjecture: "conj.";
  };

  type EditTokensByProjectIdPayload = {
    token: {
      selected_text: string;
      selected_token_ids: number[];
      tokens_with_offsets: TokenWithOffset[];
    };
  };

  type EditTokensByProjectIdResponse = {
    message: string;
  };
}
