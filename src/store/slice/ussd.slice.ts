import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { USSDState } from "../../models/application/state";
import { USSDPayload } from "../../models/application/payload";
import { MakePaymentResponseData } from "../../models/client/response";

const initialState: USSDState = {
  current: 0,
  request: {},
  responseMessage: "",
  MakePaymentResponse: new MakePaymentResponseData()
};

const ussdSlice = createSlice({
  name: "ussdSlice",
  initialState,
  reducers: {
    setUSSDState: (state, action: PayloadAction<USSDPayload>) => {
      const key: keyof USSDState = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllUSSDState: (state, action: PayloadAction<USSDState>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllUSSDState, setUSSDState } = ussdSlice.actions;
export const ussdReducer = ussdSlice.reducer;
