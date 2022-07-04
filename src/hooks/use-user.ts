import { useContext } from "react";

import { UserContext } from "src/contexts/user";

export const useUser = () => {
  const { user, setUser, isLoggedIn } = useContext(UserContext);

  return {
    user,
    setUser,
    isLoggedIn,
  };
};
