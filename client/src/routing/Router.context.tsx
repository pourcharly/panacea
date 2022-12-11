import { createContext, useContext } from "react";
import { RouterContextType } from "./Router.types";

export const RouterContext = createContext<RouterContextType>({});
export const useRouter = () => useContext(RouterContext);