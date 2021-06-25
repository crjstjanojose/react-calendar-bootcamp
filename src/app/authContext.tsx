import { IUser } from "./backend";
import React, { useContext } from "react";

export interface IAuthContext {
  user: IUser;
  onSignOut: () => void;
}

export const authContext = React.createContext<IAuthContext>({
  user: {
    name: "Anônimo",
    email: "",
  },
  onSignOut: () => {},
});

export function useAuthContext() {
  return useContext(authContext);
}
