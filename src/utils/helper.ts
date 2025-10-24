import { FormProps } from "antd";
import { setAllAppState, store } from "../store";
import { State } from "../models/application/state";
import info from "../assets/icons/info.svg";
import notFound from "../assets/images/404.svg";
import success from "../assets/images/success-check.png";
import failed from "../assets/images/failed-check.png";
import { BadRequestResponse } from "../models/client/response";
import { ResponseCode } from "../models/application/enum";
import { endpoints } from "../store/endpoints";
import { API_BASE_URL } from "../store/api/api.config";
import { Encryption } from "./encryption";

export const antdFormConfig: FormProps = {
  autoComplete: "off",
  layout: "vertical",
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  requiredMark: "optional",
};

export enum CardTypes {
  MASTERCARD = "mastercard",
  VISA = "visa",
  VERVE = "verve",
  AFRIGROBAL = "afriglobal",
  AMERICAN_EXPRESS = "american_express",
  DINERS_CLUB = "diners_club",
  JCB = "jcb",
  DISCOVER = "discover",
  MAESTRO = "maestro",
  NOT_FOUND = "",
}

export enum PaymentMethod {
  NQR = "5",
}

const date = new Date();
const offset = date.getTimezoneOffset();

export const deviceInformation = {
  httpBrowserColorDepth: window.screen.colorDepth,
  httpBrowserJavaEnabled: window.navigator.javaEnabled(),
  httpBrowserJavaScriptEnabled: true,
  httpBrowserLanguage: window.navigator.language,
  httpBrowserScreenHeight: window.screen.height,
  httpBrowserScreenWidth: window.screen.width,
  userAgentBrowserValue: window.navigator.userAgent,
  httpBrowserTimeDifference: offset?.toString(),
};

export class ApiResponseHandle {
  static errorResponse(
    state: State,
    responseCode: string | number,
    responseMessage: string,
    transactionResponse?: any
  ) {
    const title =
      responseMessage?.toLowerCase() ===
      "it's either because the link is incorrect or the transaction is already completed"
        ? "We could not start this transaction"
        : responseCode === "12" || responseCode === 404
        ? "Sorry, Payment Reference not Found"
        : responseMessage?.toLowerCase() === "record not found"
        ? "Payment Unsuccessful"
        : responseCode === "FETCH_ERROR"
        ? "Internet Disconnected"
        : responseCode === 500
        ? "Error occured"
        : responseCode === "TIME_ELAPSED"
        ? "Transfer Time Expired"
        : responseCode === "USSD_ELAPSED"
        ? "USSD Payment Timeout"
        : "Payment Unsuccessful";

    const image =
      responseMessage?.toLowerCase() ===
        "it's either because the link is incorrect or the transaction is already completed" ||
      responseCode === "12" ||
      responseCode === "FETCH_ERROR" ||
      responseCode === 500
        ? info
        : responseCode === ResponseCode.SUCCESS
        ? success
        : responseCode === 404
        ? notFound
        : failed;

    const onClick = () => {
      window.parent.postMessage("closeIframe", "*");
      sessionStorage.clear();
      if (state?.paymentInfo?.callbackUrl && window.self === window.parent) {
        const url = state.paymentInfo.callbackUrl;
        window.location.href = url;
        window.parent.postMessage(
          {
            eventType: "transactionResponse",
            apiResponse: transactionResponse,
          },
          "*"
        );
      } else if (
        state.paymentInfo?.callbackUrl &&
        window.self !== window.parent
      ) {
        let url = state.paymentInfo.callbackUrl;
        window.parent.postMessage(
          {
            eventType: "transactionResponse",
            apiResponse: transactionResponse,
          },
          "*"
        );
        window.parent.postMessage("closeIframe", "*");
        if (window?.ReactNativeWebView?.postMessage) {
          window?.ReactNativeWebView?.postMessage(
            JSON.stringify({
              eventType: "closeIframe",
            })
          );
        }
        if (!/^https?:\/\//i.test(url)) {
          url = "https://" + url;
        }
        window.location.href = url;
        window.close();
      } else if (
        !state.paymentInfo?.callbackUrl &&
        window.self !== window.parent
      ) {
        window.parent.postMessage(
          {
            eventType: "transactionResponse",
            apiResponse: transactionResponse,
          },
          "*"
        );
        window.parent.postMessage("closeIframe", "*");
      } else {
        window.history.back();
        window.parent.postMessage("closeIframe", "*");
      }
    };

    const btnName =
      responseMessage?.toLowerCase() ===
        "it's either because the link is incorrect or the transaction is already completed" ||
      responseCode === "FETCH_ERROR" ||
      responseCode === 500
        ? "Reload"
        : "Close this window";

    store.dispatch(
      setAllAppState({
        ...state,
        showResponsePage: true,
        responseTitle: title,
        responseDescription:
          responseCode === "FETCH_ERROR"
            ? "There's no internet connectivity"
            : responseCode === 404
            ? "Kindly initialize payment from the merchant Please go back and try again."
            : responseCode === 500
            ? "An error occured from our end, please try again later"
            : responseMessage,
        responseImage: image,
        responseBtnName: btnName,
        responseOnClick: onClick,
        transactionResponse,
      })
    );
  }

  static successResponse(state: State, apiResponse: any) {
    const onClick = () => {
      window.parent.postMessage("closeIframe", "*");
      sessionStorage.clear();
      localStorage.clear();
      if (state.paymentInfo.callbackUrl && window.self === window.parent) {
        const { callbackUrl, transactionId } = state.paymentInfo;
        const separator = callbackUrl.includes("?") ? "&" : "?";
        // window.location.replace(
        //   `${callbackUrl}${separator}transactionId=${transactionId}`
        // );
        window.location.href = `${callbackUrl}${separator}transactionId=${transactionId}`;
      } else if (window.self !== window.parent) {
        let url = state.paymentInfo.callbackUrl;
        window.parent.postMessage(
          { eventType: "transactionResponse", apiResponse },
          "*"
        );
        window.parent.postMessage("closeIframe", "*");
        if (!/^https?:\/\//i.test(url)) {
          url = "https://" + url;
        }
        if (window?.ReactNativeWebView?.postMessage) {
          window?.ReactNativeWebView?.postMessage(
            JSON.stringify({
              eventType: "closeIframe",
            })
          );
        }
        window.location.href = url;
        window.close();
      } else {
        window.history.back();
        window.parent.postMessage("closeIframe", "*");
      }
    };

    store.dispatch(
      setAllAppState({
        ...state,
        showResponsePage: true,
        responseTitle: "Payment successful",
        responseDescription:
          "The payment is successful, you can close this window now.",
        responseImage: success,
        responseBtnName: "Close this window",
        responseOnClick: onClick,
        transactionResponse: apiResponse,
      })
    );
  }
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Masks a credit card number, showing only the last 4 digits.
 * @param {string} cardNumber - The full credit card number as a string.
 * @returns {string} - The masked credit card number.
 */
export function maskCardNumber(cardNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = cardNumber?.replace(/\D/g, "");

  // Check if the cleaned card number has at least 4 digits
  if (cleaned.length <= 4) {
    return cleaned; // No masking needed if card number is too short
  }

  // Mask all but the last 4 digits
  const masked = cleaned?.slice(0, -4).replace(/\d/g, "*") + cleaned?.slice(-4);

  return masked;
}

export const generateBadRequestErrorMessage = (error: any): string => {
  if (error?.data?.responseMessage) {
    return error?.data?.responseMessage;
  } else {
    const apiError: BadRequestResponse = error?.data;
    const errorFields: string[] = Object.keys(apiError.errors);
    let message = `${camelCaseToTitle(errorFields[0])} is required`;
    return message.replace("$.", "");
  }
};

export const camelCaseToTitle = (str: string) => {
  // Insert a space before any uppercase letters preceded by a lowercase letter
  const titleCase = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first letter of each word
  const words = titleCase.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the words back together
  const title = capitalizedWords.join(" ");

  return title;
};

export const maskEmail = (email: string): string => {
  if (email) {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }

    const [username, domain] = email.split("@");

    // Mask the username
    const maskedUsername =
      username.length > 2
        ? `${username[0]}...${username[username.length - 1]}`
        : `${username[0]}...`;

    // Preserve the top-level domain (e.g., '.com') and mask the rest if it exceeds 10 characters
    const domainParts = domain.split(".");
    const tld = domainParts.pop(); // Extract the top-level domain
    const baseDomain = domainParts.join(".");
    const maskedDomain =
      baseDomain.length > 7
        ? `${baseDomain.substring(0, 7)}...${tld}`
        : `${baseDomain}.${tld}`;

    return `${maskedUsername}@${maskedDomain}`;
  } else {
    return "N/A";
  }
};

export const updatePaymentActivity = (
  message: string,
  type: string,
  app: State
) => {
  try {
    fetch(`${API_BASE_URL}${endpoints.UpdateUserActivities}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${Encryption.decrypt(app.token)?.replace(
          /^"|"$/g,
          ""
        )}`,
      },
      body: JSON.stringify({
        accessCode: window.location.href.split("/").pop(),
        transactionId: app.paymentInfo?.transactionId,
        type,
        message,
      }),
    }).catch(() => {});
  } catch {}
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function formatSecondsToMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min:${remainingSeconds} secs`;
}

export function getTextColor(backgroundColor: string): "black" | "white" {
  const namedColors: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    gray: "#808080",
    grey: "#808080",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    brown: "#a52a2a",
    // Add more if needed
  };

  backgroundColor = backgroundColor.trim().toLowerCase();

  // Convert named color to hex
  if (namedColors[backgroundColor]) {
    backgroundColor = namedColors[backgroundColor];
  }

  // Convert RGB to hex
  const rgbMatch = backgroundColor.match(
    /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1).map((x) => parseInt(x, 10));
    backgroundColor =
      "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  // Match hex format
  const hexMatch = backgroundColor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hexMatch) {
    // Not a valid color format
    return "black";
  }

  let hex = hexMatch[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // YIQ formula for brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "black" : "white";
}

export function lightenColor(color: string, percent: number): string {
  // Named colors map
  const namedColors: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    gray: "#808080",
  };

  // Normalize input
  color = color.toLowerCase();
  if (namedColors[color]) {
    color = namedColors[color];
  }

  // Clamp percent between 0 and 100
  const p = Math.min(100, Math.max(0, percent)) / 100;

  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    // HEX to RGB
    const hex = color.replace("#", "");
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex,
      16
    );
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (color.startsWith("rgb")) {
    // Extract numbers from rgb or rgba
    const parts = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    [r, g, b] = parts;
  } else {
    throw new Error("Unsupported color format. Use HEX, RGB, or named colors.");
  }

  // Lighten formula: move each channel towards 255 (white)
  r = Math.round(r + (255 - r) * p);
  g = Math.round(g + (255 - g) * p);
  b = Math.round(b + (255 - b) * p);

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
