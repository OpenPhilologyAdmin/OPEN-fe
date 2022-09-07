import { confirmAccountHandler } from "./confirm-account";
import { getProjectByIdHandler, importFileHandler } from "./import-file";
import {
  deleteProjectByIdHandler,
  getProjectListHandler,
  updateProjectByIdHandler,
} from "./library";
import { approveUserByIdHandler, getUsersListHandler } from "./manage-users";
import { newPasswordHandler } from "./new-password";
import {
  getInsignificantVariantsForProjectById,
  getSignificantVariantsForProjectById,
  getTokenDetailsForProjectById,
  getTokensForProjectById,
  updateGroupedVariantsForTokenById,
} from "./project";
import { registerAccountHandler } from "./register-account";
import { resendActivationEmailHandler } from "./resend-activation-email";
import { resetPasswordHandler } from "./reset-password";
import { signInHandler } from "./sign-in";
import {
  deleteWitnessByIdEndpointHandler,
  getWitnessListByProjectId,
  updateWitnessByIdHandler,
} from "./witness-list";

export const handlers = [
  signInHandler,
  registerAccountHandler,
  resetPasswordHandler,
  newPasswordHandler,
  resendActivationEmailHandler,
  confirmAccountHandler,
  getUsersListHandler,
  approveUserByIdHandler,
  getProjectByIdHandler,
  importFileHandler,
  updateProjectByIdHandler,
  deleteProjectByIdHandler,
  getProjectListHandler,
  deleteWitnessByIdEndpointHandler,
  updateWitnessByIdHandler,
  getWitnessListByProjectId,
  getSignificantVariantsForProjectById,
  getTokensForProjectById,
  getInsignificantVariantsForProjectById,
  updateGroupedVariantsForTokenById,
  getTokenDetailsForProjectById,
];
