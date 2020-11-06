import React from "react";

type LoadingState = "idle" | "loading" | "success" | "error";

const useLoadingState = (initialState: LoadingState = "idle") => {
  const [state, setState] = React.useState(initialState);

  const update = (newState: LoadingState) => {
    setState(newState);
  };

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isIdle = state === "idle";
  return {
    state,
    update,
    isLoading,
    isSuccess,
    isError,
    isIdle,
  };
};

export default useLoadingState;
