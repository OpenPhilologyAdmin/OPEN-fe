import { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import styled from "styled-components";

import Typography from "../typography";

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 72px;
  width: 100%;
  background: linear-gradient(90deg, #fc6f46 0%, #fdbd4b 50%);
`;

const LogoSideWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textPrimary};
`;

const ActionsSideWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalDivider = styled.hr`
  margin: 0 24px;
  height: 40px;
  width: 1px;
  background-color: ${props => props.theme.colors.textPrimary};
`;

type HeaderProps = ComponentPropsWithoutRef<"header">;

function Header({ children, ...props }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <Wrapper {...props}>
      <LogoSideWrapper>
        <Link href="/">
          <a>
            <Image height="26" width="240" src="/images/logo.svg" alt={t("header.logo_alt")} />
          </a>
        </Link>
        <VerticalDivider />
        <Typography as="h1" variant="body-bold">
          {t("header.editing_environment")}
        </Typography>
      </LogoSideWrapper>
      <ActionsSideWrapper>{children}</ActionsSideWrapper>
    </Wrapper>
  );
}

export default Header;
