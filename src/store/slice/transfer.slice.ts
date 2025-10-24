import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TransferState } from "../../models/application/state";
import { TransferPayload } from "../../models/application/payload";
import { MakePaymentResponseData } from "../../models/client/response";

const initialState: TransferState = {
    current: 0,
    MakePaymentResponse: new MakePaymentResponseData()
};

const transferSlice = createSlice({
  name: "transferSlice",
  initialState,
  reducers: {
    setTransferState: (state, action: PayloadAction<TransferPayload>) => {
      const key: keyof TransferState = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllTransferState: (state, action: PayloadAction<TransferState>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllTransferState, setTransferState } = transferSlice.actions;
export const transferReducer = transferSlice.reducer;
