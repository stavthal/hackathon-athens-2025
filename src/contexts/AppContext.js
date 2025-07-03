import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isPRListCollapsed, setIsPRListCollapsed] = useState(false);

  const collapsePRList = () => setIsPRListCollapsed(true);
  const expandPRList = () => setIsPRListCollapsed(false);
  const togglePRList = () => setIsPRListCollapsed((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        isPRListCollapsed,
        collapsePRList,
        expandPRList,
        togglePRList,
        setIsPRListCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
