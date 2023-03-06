import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import "jest-styled-components";
import "jest";
import "blob-polyfill";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: key => key }),
  i18n: { t: key => key },
}));
