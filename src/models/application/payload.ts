import {
  BankState,
  CardState,
  State,
  TransferState,
  USSDState,
  WalletState,
} from "./state";

export class StatePayload {
  key: keyof State;
  value?: any;
  constructor(key: keyof State, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class CardPayload {
  key: keyof CardState;
  value?: any;
  constructor(key: keyof CardState, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class USSDPayload {
  key: keyof USSDState;
  value?: any;
  constructor(key: keyof USSDState, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class BankPayload {
  key: keyof BankState;
  value?: any;
  constructor(key: keyof BankState, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class TransferPayload {
  key: keyof TransferState;
  value?: any;
  constructor(key: keyof TransferState, value: any) {
    this.key = key;
    this.value = value;
  }
}

export class WalletPayload {
  key: keyof WalletState;
  value?: any;
  constructor(key: keyof WalletState, value: any) {
    this.key = key;
    this.value = value;
  }
}
