import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiConfig, verificationConfig } from "./api/api.config";
import { appReducer, setAllAppState, setAppState } from "./slice/app.slice";
import { cardReducer, setAllCardState, setCardState } from "./slice/card.slice";
import { ussdReducer, setAllUSSDState, setUSSDState } from "./slice/ussd.slice";
import { bankReducer, setAllBankState, setBankState } from "./slice/bank.slice";
import { transferReducer } from "./slice/transfer.slice";
import {
  setAllWalletState,
  setWalletState,
  walletReducer,
} from "./slice/wallet.slice";

const rootReducer = combineReducers({
  app: appReducer,
  wallet: walletReducer,
  card: cardReducer,
  ussd: ussdReducer,
  bank: bankReducer,
  transfer: transferReducer,
  [apiConfig.reducerPath]: apiConfig.reducer,
  [verificationConfig.reducerPath]: verificationConfig.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.PROD === false,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiConfig.middleware, verificationConfig.middleware);
  },
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

setupListeners(store.dispatch);

export {
  setAllAppState,
  setAppState,
  setAllCardState,
  setCardState,
  setAllUSSDState,
  setUSSDState,
  setAllBankState,
  setBankState,
  setWalletState,
  setAllWalletState,
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
