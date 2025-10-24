import { SaveCard } from "../client/request";
import {
  API,
  BankAccountValidation,
  PaymentInfo,
  SavedCards,
  MakePaymentResponseData,
  WalletAuthentication,
  PaymentMethods,
} from "../client/response";

export interface State {
  postUrl: string;
  getUrl: string;
  menuKey?: string;
  showPaymentPage?: boolean;
  current: number;
  request: any;
  paymentInfo: PaymentInfo;
  apiResponse: API<PaymentInfo>;
  responseTitle: string;
  responseDescription: string;
  responseImage: string;
  responseBtnName: string;
  responseOnClick?: () => void;
  showResponsePage: boolean;
  transactionResponse?: any;
  token: string;
  publicKey: string;
  hideCard: boolean;
  showErrorAlert?: boolean;
  qrCode?: string;
  selectedPaymentMethod?: PaymentMethods
}

export interface CardState {
  useSavedCardVerification: boolean;
  current: number;
  request: any;
  shouldRemeberCard: boolean;
  showSavedCards: boolean;
  cardType: string;
  saveCardRequest: SaveCard;
  apiResponse: API<any>;
  savedCards: Array<SavedCards>;
  MakePaymentResponse: MakePaymentResponseData;
  showConsent: boolean;
  showMasterCardInternational: boolean;
  redirectType?: "interSwitch" | undefined;
}

export interface USSDState {
  current: number;
  request: any;
  responseMessage: string;
  MakePaymentResponse?: MakePaymentResponseData;
}

export interface BankState {
  current: number;
  request: any;
  apiResponse: API<BankAccountValidation>;
}

export interface TransferState {
  current: number;
  MakePaymentResponse?: MakePaymentResponseData;
  request?: any;
}

export interface WalletState {
  pageType: "authenticate" | "wallet_details" | "pin" | "confirm_payment";
  request: { userName: string; password: string; pin?: string };
  pin?: string;
  details?: WalletAuthentication;
  isLoginError?: boolean;
  loginErrorMessage?: string;
}
