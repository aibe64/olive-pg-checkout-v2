export class MakePayment {
  transactionId: string = "";
  paymentType: string = "";
  expiryDate: string = "";
  bankCode: string = "";
  accountNumber: string = "";
  accountName: string = "";
  cardNumber: string = "";
  cvv: string = "";
  expiryMonth: string = "";
  expiryYear: string = "";
  currency: string = "";
  country: string = "";
  amount: string = "";
  email: string = "";
  phoneNumber: string = "";
  firstName: string = "";
  lastName: string = "";
  ip: string = "";
  dateOfBirth: string = "";
  bvn: string = "";
  redirectUrl: string = "";
  billingZip: string = "";
  billingCity: string = "";
  deviceFingerPrint: string = "";
  billingAddress: string = "";
  billingState: string = "";
  billingCountry: string = "";
  pin: string = "";
  callbackUrl: string = "";
  productId: string = "";
  productDescription: string = "";
  pageKey: string = "";
  productKey: string = "";
  authenticationResend: string = "";
  merchantType: string = "";
  metaData: string = "";
  narration: string = "";
  merchantId: number = 0;
  cardBrand: string = "";
  token: string = "";
  entryType: string = "";
  deviceInformation: DeviceInformation = new DeviceInformation();
  walletOption: string = "";
  invoiceId: string = "";
  isRecurring: boolean = false;
  isStaticRoute: number = 0;
}

export class DeviceInformation {
  httpBrowserLanguage: string = "";
  httpBrowserJavaEnabled: boolean = false;
  httpBrowserJavaScriptEnabled: boolean = false;
  httpBrowserColorDepth: number = 0;
  httpBrowserScreenHeight: number = 0;
  httpBrowserScreenWidth: number = 0;
  httpBrowserTimeDifference: string = "";
  userAgentBrowserValue: string = "";
}

export class SaveCard {
  cardPan: string = "";
  expiryMonth: string = "";
  expiryYear: string = "";
  cvv: string = "";
  cardBrand: string = "";
  firstname: string = "";
  lastname: string = "";
  email: string = "";
}

export class ValidateBankAccount {
  bankCode: string = "";
  accountNumber: string = "";
  accountName?: string = "";
}

export class RemoveCard {
  email: string = "";
  pan: string = "";
}

export class ResendOtp {
  transactionId: string = "";
  providerReference: string = "";
  otp?: string = "";
  entryType: string = "";
}

export class UserActivity {
  accessCode?: string;
  transactionId?: string;
  type?: string;
  message?: string;
}
