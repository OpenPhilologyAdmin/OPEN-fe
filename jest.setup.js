import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import "jest-styled-components";
import "jest";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: key => key }),
}));
