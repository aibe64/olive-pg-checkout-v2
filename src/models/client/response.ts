import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface Bin {
  Id: number;
  Name: string;
  MinPanLength: number;
  MaxPanLength: number;
  BinRangeMinimum: number;
  BinRangeMaximum: number;
  BinImage: string;
}

export class API<T> {
  $id: string = "";
  responseCode: string = "";
  responseMessage: string = "";
  error: string = "";
  status: string = "";
  data?: T;
}

export interface TransferVerificationResponse {
  ResponseCode: string;
  ResponseMessage: string;
  Data: null;
}

export type BaseQueryResponse =
  | {
      data: any;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: FetchBaseQueryError | SerializedError;
    };

export interface BaseQueryErrorResponse {
  status: number | string;
  error: string;
  data: API<null>;
}

export interface BadRequestResponse {
  type: string;
  title: string;
  status: number;
  errors: Errors;
  traceId: string;
}

export interface Errors {
  $: string[];
  tokenization: string[];
}

export class PaymentInfo {
  $id: string = "";
  email: string = "";
  amount: string = "";
  transactionId: string = "";
  link: string = "";
  reference: any;
  businessName: string = "";
  isActive: boolean = false;
  cardPayment: boolean = false;
  accountPayment: boolean = false;
  ussdPayment: boolean = false;
  qrPayment: boolean = false;
  eNaira: boolean = false;
  walletPayment: boolean = false;
  bankTransferPayment: boolean = false;
  logo: any;
  webHookUrl: string = "";
  token: string = "";
  currency: string = "";
  callbackUrl: string = "";
  metadata: string = "";
  publicKey: string = "";
  transactionHistoryId: number = 0;
  merchantId: number = 0;
  productId: string = "";
  productDescription: string = "";
  totalAmount: string = "";
  isChargeTransferedToCustomer: boolean = false;
  isPaymentPageCustomizationEnabled: boolean = false;
  customization: Customization = new Customization();
  isRecurring: boolean = false;
  stage: number = 0;
  paymentMethods: string = ""
  paymentMethod: PaymentMethods[] = new Array<PaymentMethods>
}

export class PaymentMethods {
  paymentMethodId?: number
  paymentType?: string
  description?: string
  chargeAmount?: number
  totalAmount?: number
}

export class Customization {
  $id: string = "";
  bodyColor: any;
  buttonColor: any;
  footerText: any;
  footerLink: any;
  footerLogo: any;
  logoUrl: string = ""
}

export class UssdBanks {
  $id: string = "";
  bankName: string = "";
  bankCode: string = "";
  ussdString: string = "";
}

export class MakePaymentResponse {
  $id: string = "";
  responseCode: string = "";
  responseMessage: string = "";
  data?: MakePaymentResponseData
}

export class MakePaymentResponseData {
  suggestedAuthentication: any = ""
  transactionId: string = ""
  redirectUrl: string = ""
  authUrl: string = ""
  authData: string = ""
  validationInstruction: any = ""
  providerReference: string = ""
  transactionNumber: string = ""
  flagCode: string = ""
  callBackUrl: string = ""
  payloadContent: any = ""
  mandateCode: string = ""
  transType: any = ""
  md: string = ""
  paymentId: string = ""
  accountNumber: any = ""
  accountName: any = ""
  bankName: any = ""
  isWebhookUrlSet: boolean = false
  jwt: string = ""
}

export interface WalletAuthentication {
  bankName: string
  balance: number
  accountNumber: string
  tagName: string
  userName: string
  token: string
}


export class GetBanksForPayment {
  $id: string = "";
  id: number = 0;
  bankName: string = "";
  bankCode: string = "";
  logoUrl: any;
  isPhoneNumberRequired: boolean = false;
  isDateOfBirthRequired: boolean = false;
  isBvnRequired: boolean = false;
  isNarrationRequired: boolean = false;
  isNameRequired: boolean = false;
  isVisibleToMerchantForPayment: boolean = false;
  provider: string = "";
  dateCreated: string = "";
  dateModified: any;
  isPinRequired: boolean = false;
}

export class BankAccountValidation {
  $id: string = "";
  accountName: string = "";
  accountNumber: string = "";
}

export class SavedCards {
  $id: string = "";
  CardPan: string = "";
  ExpiryMonth: string = "";
  ExpiryYear: string = "";
  Cvv: string = "";
  CardBrand: string = "";
  Firstname: string = "";
  Lastname: string = "";
  Email: string = "";
}

export class VerifyPayment {
  $id: string = "";
  amount: string = "";
  paymentType: string = "";
  currency: string = "";
  status: any;
  isSuccessful: boolean = false;
  gatewayResponse: string = "";
  transactionId: string = "";
  productId: any;
  productDescription: any;
  paymentDate: any;
  callBackUrl: any;
  paymentReference: string = "";
  recurringID: any;
  histories: Histories = new Histories();
  merchantId: number = 0;
}

export class Histories {
  $id: string = "";
  $values: any[] = [];
}
