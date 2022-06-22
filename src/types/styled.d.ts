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
      backgroundPrimary: string;
      backgroundSecondary: string;
      textPrimary: string;
      textSecondary: string;
      textDimmed: string;
      actionsPrimary: string;
      actionsSecondary: string;
      actionsDisabled: string;
      error: string;
      touched: string;
      border: string;
      focusShadow: string;
      focus: string;
    };
  }
}
