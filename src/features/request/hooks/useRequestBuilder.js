import { useContext } from "react";

import { RequestContext } from "../context/RequestContextValue";

function useRequestBuilder() {
  const request = useContext(RequestContext);

  if (!request) {
    throw new Error(
      "useRequestBuilder must be used within a RequestProvider.",
    );
  }

  return request;
}

export default useRequestBuilder;