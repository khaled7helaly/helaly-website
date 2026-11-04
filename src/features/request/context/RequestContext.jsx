import { useReducer } from "react";
import { Outlet } from "react-router";

import requestReducer from "../reducers/requestReducer";
import requestInitialState from "../reducers/requestInitialState";
import { RequestContext } from "./RequestContextValue";

function RequestProvider({ children }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  return (
    <RequestContext.Provider value={{ state, dispatch }}>
      {children ?? <Outlet />}
    </RequestContext.Provider>
  );
}

export default RequestProvider;
