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
  ) => Promise<ServerSidePropsGeneric>,
  options: Options,
) {
  return (async context => {
    let loggedInUser: API.User | null = null;

    try {
      if (hasCookieServerSide(context)) {
        const token = getServerSideAuthToken(context);

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
      // remove cookie if not logged in an cookie exists
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
      const result = await callback(context, loggedInUser);
      const props = result && "props" in result ? result.props : {};

      // redirects to 404 on demand
      if ("notFound" in result) {
        return {
          notFound: true,
        };
      }

      // if not approved by admin redirect to confirmation page
      if (!loggedInUser.account_approved) {
        return {
          ...result,
          redirect: {
            destination: ROUTES.CONFIRM_ACCOUNT(),
            permanent: false,
          },
          props: {
            user: loggedInUser,
            ...props,
          },
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
    const result = await callback(context, null);
    const props = result && "props" in result ? result.props : {};

    return {
      ...result,
      props: {
        user: loggedInUser,
        ...props,
      },
    };
  }) as GetServerSideProps<ServerSidePropsGeneric>;
}
