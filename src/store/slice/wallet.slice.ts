import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { WalletState } from "../../models/application/state";
import { WalletPayload } from "../../models/application/payload";

const initialState: WalletState = {
  pageType: "authenticate",
  request: { userName: "", password: "" },
};

const WalletSlice = createSlice({
  name: "WalletSlice",
  initialState,
  reducers: {
    setWalletState: (state, action: PayloadAction<WalletPayload>) => {
      const key: keyof WalletState = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllWalletState: (state, action: PayloadAction<WalletState>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllWalletState, setWalletState } = WalletSlice.actions;
export const walletReducer = WalletSlice.reducer;
