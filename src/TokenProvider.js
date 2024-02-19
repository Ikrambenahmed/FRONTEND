import { createContext, useContext, useReducer, useMemo } from "react";

const TokenContext = createContext(null);

const tokenReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return { ...state, token: action.token };
    case "CLEAR_TOKEN":
      return { ...state, token: null };
    case "SET_USER_ID":
      return { ...state, userId: action.userId };
    default:
      return state;
  }
};
const TokenProvider = ({ children }) => {
  const [token, dispatch] = useReducer(tokenReducer, { token: null, userId: null });

  const setToken = (newToken) => {
    dispatch({ type: "SET_TOKEN", token: newToken });
  };

  const clearToken = () => {
    dispatch({ type: "CLEAR_TOKEN" });
  };
  
  const setUserId = (userId) => {
    dispatch({ type: "SET_USER_ID", userId });
  };

  const value = useMemo(() => ({ token, setToken, userId: token.userId, setUserId, clearToken }), [token]);

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};

const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};

export { TokenProvider, useToken };
