// Import the necessary dependencies
import React, { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";

// Create the Authentication context
const AuthContext = createContext(null);

// Define the authentication reducer and provider
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.user };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const initialState = { isAuthenticated: false, user: null };
  const [authState, authDispatch] = useReducer(authReducer, initialState);
  const value = useMemo(() => [authState, authDispatch], [authState, authDispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used inside the AuthProvider.");
  }
  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProvider, useAuth };
