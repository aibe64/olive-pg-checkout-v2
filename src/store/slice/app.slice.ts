import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { State } from "../../models/application/state";
import { StatePayload } from "../../models/application/payload";
import { API, PaymentInfo } from "../../models/client/response";

const initialState: State = {
  postUrl: "",
  getUrl: "",
  menuKey: "1",
  current: 0,
  request: {},
  paymentInfo: new PaymentInfo(),
  apiResponse: new API(),
  showResponsePage: false,
  responseTitle: "",
  responseDescription: "",
  responseImage: "",
  responseBtnName: "",
  token: "",
  publicKey: "",
  hideCard: false
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setAppState: (state, action: PayloadAction<StatePayload>) => {
      const key: keyof State = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllAppState: (state, action: PayloadAction<State>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllAppState, setAppState } = appSlice.actions;
export const appReducer = appSlice.reducer;
