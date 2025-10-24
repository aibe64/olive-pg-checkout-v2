import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { State } from "../models/application/state";
import { setAllAppState } from "../store";

interface ToggleFunction {
  onCurrentChange: (state: State) => void;
}

const useToggle = (): ToggleFunction => {
  const dispatch = useAppDispatch();

  const onCurrentChange = useCallback(
    (state: State) => {
      dispatch(
        setAllAppState({
          ...state,
          current: state.current - 1,
        })
      );
    },
    [dispatch]
  );

  return {
    onCurrentChange,
  };
};

export default useToggle;
