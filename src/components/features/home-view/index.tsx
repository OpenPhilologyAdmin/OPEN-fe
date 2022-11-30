import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import BookIcon from "@/assets/images/icons/book.svg";
import DocumentIcon from "@/assets/images/icons/document-plus.svg";
import EditIcon from "@/assets/images/icons/edit-2.svg";
import UsersIcon from "@/assets/images/icons/users-more.svg";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  grid-row-gap: 24px;
`;

function HomeView() {
  const { t } = useTranslation();
  const { isAdmin, setUser, lastEditedProject, refetchUser } = useUser();

  // reset user on page enter
  useEffect(() => {
    const updateUser = async () => {
      const user = await refetchUser();

      setUser(user.data?.data);
    };

    updateUser();
  }, [refetchUser, setUser]);

  return (
    <Wrapper>
      {lastEditedProject && (
        <Button
          key={lastEditedProject}
          href={ROUTES.PROJECT(lastEditedProject)}
          variant="primary"
          left={<EditIcon />}
        >
          {t("home.continue_editing")}
        </Button>
      )}
      <Button href={ROUTES.IMPORT_FILE()} variant="primary" left={<DocumentIcon />}>
        {t("home.create_new_edition")}
      </Button>
      <Button href={ROUTES.LIBRARY()} variant="primary" left={<BookIcon />}>
        {t("home.go_to_library")}
      </Button>
      {isAdmin && (
        <Button href={ROUTES.MANAGE_USERS()} variant="primary" left={<UsersIcon />}>
          {t("home.manage_users")}
        </Button>
      )}
    </Wrapper>
  );
}

export default HomeView;
