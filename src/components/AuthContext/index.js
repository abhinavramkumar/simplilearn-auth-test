import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

const AuthContext = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={setState}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

function useAuthState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}
function useAuthDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

export { AuthContext as default, StateContext, DispatchContext, useAuthDispatch, useAuthState };