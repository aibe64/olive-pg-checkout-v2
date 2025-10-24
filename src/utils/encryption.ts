/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js";

export class Encryption {
  static encrypt(value: any): string {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      import.meta.env.VITE_SECRET_KEY as string
    );
    return encrypted.toString();
  }

  static decrypt(value: string): string {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(
        value,
        import.meta.env.VITE_SECRET_KEY as string
      );
      return decryptedBytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  static encryptWithRequestKey(value: string): string {
    const requestKey = import.meta.env.VITE_APP_REQUEST_KEY;
    const length: number = requestKey.length;
    const midpoint: number = Math.ceil(length / 2);
    const firstHalf: string = requestKey.slice(0, midpoint);
    const secondHalf: string = requestKey.slice(midpoint);
    value = btoa(value);
    return `${firstHalf}${[...value].reverse().join("")}${secondHalf}`;
  }

  static decryptWithResponseKey(value: string): string | null {
    const responseKey = atob(import.meta.env.VITE_APP_RESPONSE_KEY);
    const length: number = responseKey.length;
    const midpoint: number = Math.ceil(length / 2);
    const firstHalf: string = responseKey.slice(0, midpoint);
    const secondHalf: string = responseKey.slice(midpoint);
    if (value.startsWith(firstHalf) && value.endsWith(secondHalf)) {
      value = value.slice(firstHalf.length, value.length - secondHalf.length);
      value = [...value].reverse().join("");
      return atob(value);
    } else {
      return null;
    }
  }
}
