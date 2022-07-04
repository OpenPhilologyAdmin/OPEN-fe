import { setFormErrors } from "@/utils/set-form-errors";

const emailValue = "email";
const passwordValue = "password";

export const FIELDS = {
  EMAIL: emailValue,
  PASSWORD: passwordValue,
} as const;

const apiError = {
  [emailValue]: ["Email error"],
  [passwordValue]: ["Password error"],
};

const setError = jest.fn();

describe("setFormErrors", () => {
  it("should set errors correctly", () => {
    setFormErrors({
      apiError: apiError,
      fields: FIELDS,
      setError,
    });

    expect(setError).toHaveBeenCalledTimes(2);

    expect(setError.mock.calls[0]).toEqual([emailValue, { message: apiError[emailValue][0] }]);
    expect(setError.mock.calls[1]).toEqual([
      passwordValue,
      { message: apiError[passwordValue][0] },
    ]);
  });
});
