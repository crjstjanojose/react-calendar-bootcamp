import { IUser } from "./backend";
import React from "react";

export const userContext = React.createContext<IUser>({
  name: "Anônimo",
  email: "",
});
