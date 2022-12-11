import { createContext, useContext } from "react";
import { AppAction } from "../enums";
import { Action, AppState, initialAppState } from "./appState";

type AppContextType = {
    state: AppState,
    dispatch: (action : Action<AppAction>) => void
};

export const AppContext = createContext<AppContextType>({ state: initialAppState, dispatch: () => void 0 });
export const useApp = () => useContext(AppContext);
