import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      circle: string;
    };
    colors: {
      textPrimary: string;
      textSecondary: string;
    };
  }
}
