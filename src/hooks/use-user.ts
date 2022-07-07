import { useContext } from "react";

import { UserContext } from "src/contexts/user";

// Consider fetching user on the client side from inside of this hook
export const useUser = () => {
  const { user, setUser, isLoggedIn } = useContext(UserContext);

  return {
    user,
    setUser,
    isLoggedIn,
  };
};
