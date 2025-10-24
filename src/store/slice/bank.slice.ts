import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BankState } from "../../models/application/state";
import { BankPayload } from "../../models/application/payload";
import { API } from "../../models/client/response";

const initialState: BankState = {
  current: 0,
  request: {},
  apiResponse: new API()
};

const bankSlice = createSlice({
  name: "bankSlice",
  initialState,
  reducers: {
    setBankState: (state, action: PayloadAction<BankPayload>) => {
      const key: keyof BankState = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllBankState: (state, action: PayloadAction<BankState>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllBankState, setBankState } = bankSlice.actions;
export const bankReducer = bankSlice.reducer;
