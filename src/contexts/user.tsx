import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

import { isLoggedInClientSide } from "@/services/auth";

type User = API.User;

type UserContextType = {
  user?: User;
  isLoggedIn: boolean;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

type Props = {
  initialUser?: User;
};

const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  user: undefined,
  setUser: () => {},
});

function UserProvider({ initialUser, children }: PropsWithChildren<Props>) {
  const [user, setUser] = useState<User | undefined>(initialUser);

  return (
    <UserContext.Provider value={{ isLoggedIn: isLoggedInClientSide(), user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
