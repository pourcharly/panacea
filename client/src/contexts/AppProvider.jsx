import { useReducer } from "react";
import { AppContext } from "./AppContext";
import { appReducer, initialAppState } from "./appState";

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
