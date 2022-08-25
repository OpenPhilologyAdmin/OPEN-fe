import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      circle: string;
    };
    colors: {
      backgroundPrimary: string;
      backgroundSecondary: string;
      textPrimary: string;
      textSecondary: string;
      textDimmed: string;
      textTertiary: string;
      actionsPrimary: string;
      actionsSecondary: string;
      actionsDisabled: string;
      actionsDisabledStrong: string;
      error: string;
      touched: string;
      borderPrimary: string;
      focusShadow: string;
      focusDestructShadow: string;
      focus: string;
      borderSecondary: string;
      tableRowActiveBackground: string;
    };
  }
}
