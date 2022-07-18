import { useRouter } from "next/router";

import { capitalize } from "@/utils/capitalize";
import { act, renderHook } from "@testing-library/react";

import { useBreadcrumbs } from "../use-breadcrumbs";

jest.mock("next/router", () => require("next-router-mock"));

describe("Breadcrumbs/useBreadcrumbs", () => {
  it("returns correct breadcrumbs for 1-route path", () => {
    const route = "example";
    const path = `/${route}`;
    const expectedBreadcrumbs = [
      {
        href: path,
        label: capitalize(route),
      },
    ];

    const { result: router } = renderHook(() => {
      return useRouter();
    });

    const { result: breadcrumbs } = renderHook(() => {
      return useBreadcrumbs();
    });

    act(() => {
      router.current.push(path);
    });

    expect(router.current).toMatchObject({ asPath: path });
    expect(breadcrumbs.current.breadcrumbs).toEqual(expectedBreadcrumbs);
  });

  it("returns correct breadcrumbs for multi-route path", () => {
    const routeOne = "example";
    const routeTwo = "happy";
    const pathOne = `/${routeOne}`;
    const pathTwo = `/${routeOne}/${routeTwo}`;
    const expectedBreadcrumbs = [
      {
        href: pathOne,
        label: capitalize(routeOne),
      },
      {
        href: pathTwo,
        label: capitalize(routeTwo),
      },
    ];

    const { result: router } = renderHook(() => {
      return useRouter();
    });

    const { result: breadcrumbs } = renderHook(() => {
      return useBreadcrumbs();
    });

    act(() => {
      router.current.push(pathTwo);
    });

    expect(router.current).toMatchObject({ asPath: pathTwo });
    expect(breadcrumbs.current.breadcrumbs).toEqual(expectedBreadcrumbs);
  });
});
