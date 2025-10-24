import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CardState } from "../../models/application/state";
import { CardPayload } from "../../models/application/payload";
import { MakePayment, SaveCard } from "../../models/client/request";
import { API, MakePaymentResponseData } from "../../models/client/response";

const initialState: CardState = {
  useSavedCardVerification: false,
  current: 0,
  request: new MakePayment(),
  shouldRemeberCard: false,
  showSavedCards: false,
  cardType: "",
  saveCardRequest: new SaveCard(),
  apiResponse: new API(),
  savedCards: [],
  MakePaymentResponse: new MakePaymentResponseData(),
  showConsent: false,
  showMasterCardInternational: false
};

const cardSlice = createSlice({
  name: "cardSlice",
  initialState,
  reducers: {
    setCardState: (state, action: PayloadAction<CardPayload>) => {
      const key: keyof CardState = action.payload.key;
      state = {
        ...state,
        [key]: action.payload.value,
      };
      return state;
    },
    setAllCardState: (state, action: PayloadAction<CardState>) => {
      state = action.payload as any;
      return state;
    },
  },
});

export const { setAllCardState, setCardState } = cardSlice.actions;
export const cardReducer = cardSlice.reducer;
