import { ErrorOption } from "react-hook-form";

type ValueOf<AnyType> = AnyType[keyof AnyType];

type SetFormErrorsParams<FieldValues> = {
  apiError: API.Error;
  fields: FieldValues;
  setError: (field: ValueOf<FieldValues>, errorOptions: ErrorOption) => void;
};

export const setFormErrors = <FieldValues>({
  apiError,
  fields,
  setError,
}: SetFormErrorsParams<FieldValues>) => {
  Object.values(fields).forEach(field => {
    if (apiError[field]) {
      setError(field, { message: apiError[field][0] });
    }
  });
};
