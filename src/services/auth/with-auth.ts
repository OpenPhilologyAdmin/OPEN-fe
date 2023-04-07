import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { COOKIES } from "@/constants/cookies";
import { ROUTES } from "@/constants/routes";

import { getLoggedInUser, getServerSideAuthToken, hasCookieServerSide } from ".";

type Options = {
  protectedPage: boolean;
};

type EmptyProps = {
  props?: Record<string, unknown>;
  notFound?: boolean;
};

export type AuthPageProps = {
  user: API.User | null;
};

export function withAuth<ServerSidePropsGeneric extends EmptyProps>(
  callback: (
    ctx: GetServerSidePropsContext,
    user: API.User | null,
    token: string | null,
  ) => Promise<ServerSidePropsGeneric>,
  options: Options,
) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return (async context => {
    let loggedInUser: API.User | null = null;
    let token: string | null = null;

    try {
      if (hasCookieServerSide(context)) {
        token = getServerSideAuthToken(context);

        if (token) {
          const { data } = await getLoggedInUser(token);

          loggedInUser = data;
        }
      }
    } catch (error) {
      // expected unauthorized error
      loggedInUser = null;
    }

    // if page should be protected and user is not logged in, redirect to login page
    if (options.protectedPage && !loggedInUser) {
      // remove cookie if not logged in and cookie exists
      if (hasCookieServerSide(context)) {
        // delete expired cookie
        context.res.setHeader("Set-Cookie", [`${COOKIES.ACCESS_TOKEN}=deleted; Max-Age=0`]);
      }

      return {
        redirect: {
          destination: ROUTES.SIGN_IN(),
          permanent: false,
        },
      };
    }

    // if user is logged in, execute getServerSidePropsCallback
    if (callback && loggedInUser) {
      const result = await callback(context, loggedInUser, token);
      const props = result && "props" in result ? result.props : {};

      // redirects to 404 on demand
      if ("notFound" in result) {
        return {
          notFound: true,
        };
      }

      return {
        ...result,
        props: {
          user: loggedInUser,
          ...props,
        },
      };
    }

    // if user not logged in and page not protected, just return the unprotected page
    const result = await callback(context, null, null);
    const props = result && "props" in result ? result.props : {};

    return {
      ...result,
      props: {
        user: loggedInUser,
        token,
        ...props,
      },
    };
  }) as GetServerSideProps<ServerSidePropsGeneric>;
}
