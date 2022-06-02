This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Core commands

```bash
# setup
yarn && yarn prepare
```

```bash
# development server
yarn dev
```

```bash
# create production build
yarn build
```

```bash
# serve production build
yarn start
```

```bash
# run tests
yarn test
```

```bash
# run lints
yarn lint
```

```bash
# run typecheck
yarn typecheck
```

## Environment variables

They are served in different variations of `.env` files:

- For local environment we use `.env.local`
- For development environment we use `.env.development`
- For production environment we use `.env.production`

## Guidelines for coding and reviews:

Keep an eye on the guidelines while submitting your PRs and while reviewing others' to assure code quality and
consistency in the project.

1. Use snapshots only for base UI components like buttons or form controls.
2. Use `styled-components` for styling and use theme as the source of truth for colors, borders and typography. Do not
   use inline styles or CSS files. When you import a components and you want to apply styles on top of it (and you can't
   think of a meaningful name), you can use the following convention:

```javascript
import BaseButton from "./button";
const Button = styled(BaseButton)`
  ...
`;
```

3. Prefer function keyword for component and hook names and arrow function for everything else like callbacks and event
   handlers.
4. Always prefer functional components except really rare scenario where you need access methods of React component that
   are not available in a functional component.
5. Write texts as translation strings only, see public/locales/en/common.json.
6. Do not nest ternaries.
7. Prefer early return whenever possible, see example:

```javascript
// Without early return return
const myfunction = function () {
  if (myCondition) {
    // some other stuff
    return stuff;
  }
  return null;
};

// With early return
const myfunction = function () {
  if (!myCondition) return null;
  // some other stuff
};
```

8. Do not violate HTML principles when writing JSX and keep an eye on accessibility, you can use helper tools like
   Lighthouse audit or aXe devtools extension.
9. Prefer `hooks` for reusing logic, do not use `Render Props`, do not use `HOC`.
10. Feel free to suggest your own guidelines on the fly as basis for future development and code reviews.
11. We squash PRs so you don't need to follow any specific commit convention while working on them, however, when you
    want to merge your PR the PR title has to follow a specific convention. It starts with the Jira issue ID in square
    brackets, followed by colon and a short message. Then use a line-break and write a more detailed description for the
    issue (or the text-area if merging through github). See example below:

```git
[OPLU-103]: project setup

This PR introduces base conventions, core library setup and initial project structure.
```

12. Use naming convention for branches suggested by Jira

```git
OPLU-103-project-setup
```

13. Name constants in UPPER_SNAKE_CASE.
14. In hooks directory, store only hooks that are used more than once, do not store feature-specific hooks there, such
    hooks belong to their feature.
15. For working with forms use react-hook-form and zod, [see example](https://github.com/react-hook-form/resolvers#zod).
16. Every request should be tested and mocked using MSW.
17. Everything related to `react-testing-library` is imported from test-utils.
18. Always use meaningful variables, avoid abbreviations or single-character variable names
19. Do not store gradients in the theme.
20. Prefer types to interfaces for type declarations.

## Core resources

- https://testing-library.com/
- https://mswjs.io/
- https://nextjs.org/
- https://react-query.tanstack.com/
- https://github.com/isaachinman/next-i18next
- https://react-query.tanstack.com/
- https://styled-components.com/
