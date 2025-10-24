import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppState } from "../store";
import { State } from "../models/application/state";

interface MenuKeyFunction {
  onMenuKeyChange: (value: string) => void;
  state: State
}

const useMenuKeys = (): MenuKeyFunction => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => {
    return state.app
  })

  const onMenuKeyChange = useCallback(
    (value: string) => {
      dispatch(
        setAppState({
          key: "menuKey",
          value,
        })
      );
    },
    [dispatch]
  );

  return { onMenuKeyChange, state };
};

export default useMenuKeys;
