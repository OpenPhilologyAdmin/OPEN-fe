import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import LogoutIcon from "@/assets/images/icons/power.svg";
import UserIcon from "@/assets/images/icons/user.svg";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import { signOut } from "@/services/auth";
import styled from "styled-components";

const UserName = styled(Typography)`
  margin: 0 24px 0 4px;
`;

const LoggedInContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

function Logout() {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { user, isLoggedIn, setUser } = useUser();
  const handleLogout = async () => {
    await signOut();
    push(ROUTES.SIGN_IN());
    setUser(undefined);
  };

  if (!isLoggedIn || !user) return null;

  return (
    <LoggedInContentWrapper>
      <>
        <UserIcon />
        <UserName>{user.name}</UserName>
      </>
      <Button left={<LogoutIcon />} onClick={handleLogout} variant="primary" small>
        {t("header.logout")}
      </Button>
    </LoggedInContentWrapper>
  );
}

export default Logout;
