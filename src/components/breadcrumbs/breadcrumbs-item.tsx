import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

type BreadcrumbsItemProps = ComponentPropsWithoutRef<"li"> & {
  href: string;
};

export function BreadcrumbsItem({ children, href, ...props }: BreadcrumbsItemProps) {
  return (
    <li {...props}>
      <Link href={href}>
        <a>{children}</a>
      </Link>
    </li>
  );
}
