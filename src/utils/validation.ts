import { i18n } from "next-i18next";

import * as zod from "zod";

export const passwordRules = (translationPrefix?: string) =>
  zod
    .string()
    .min(8, {
      message: i18n?.t(`${translationPrefix || ""}password_invalid_length`),
    })
    .refine(value => /\d/.test(value), {
      message: i18n?.t(`${translationPrefix || ""}password_no_number`),
    });
