import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Google Font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Slab:wght@400;600;700&display=swap');

  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    font-size: inherit;
    font-weight: unset;
    margin: 0;
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul,
  ol, li {
    list-style: none;
    margin: 0;
    padding: 0
  }

  /* Set core root defaults */
  html {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
    font-size: 16px;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Reset link styles */
  a {
    color: inherit;
    text-decoration: inherit;
  }

  hr {
    border: none;
  }

  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Prevent text-selection of route announcer from next */
  next-route-announcer {
    user-select: none;
  }

  /* Allotment library style */

  .sash, .sash-active {
    &::before {
      position: absolute;
      display: block;
      content: '';
      height: 32px !important;
      width: 32px !important;
      top: 50%;
      left: -12px !important;
      z-index: 0;
      transform: translateX(-50%);
      transform: translateY(-50%);
      background: none !important;
      background-image: url("/images/allotment-handle.png") !important;
    }
  }
`;
