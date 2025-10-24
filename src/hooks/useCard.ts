import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAllCardState, setAppState, setCardState } from "../store";
import { CardState, State } from "../models/application/state";
import {
  ApiResponseHandle,
  CardTypes,
  deviceInformation,
  generateBadRequestErrorMessage,
  updatePaymentActivity,
} from "../utils/helper";
import { FormInstance } from "antd";
import {
  API,
  BaseQueryErrorResponse,
  Bin,
  MakePaymentResponse,
  MakePaymentResponseData,
  PaymentInfo,
  SavedCards,
} from "../models/client/response";
import BIN from "../models/client/bin.json";
import {
  API_BASE_URL,
  useLazyGetDataQuery,
  useMutateDataMutation,
} from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import useNotification from "./useNotification";
import { RemoveCard, ResendOtp } from "../models/client/request";

import mastercard from "../assets/images/mastercard.svg";
import visa from "../assets/images/visa.png";
import verve from "../assets/images/verve.png";
import discover from "../assets/images/discover.png";
import diner from "../assets/images/diners.png";
import maestro from "../assets/images/maestro.png";
import afrigo from "../assets/images/afrigo.jpeg";
import jcb from "../assets/images/jcb.jpeg";
import amex from "../assets/images/amex.png";
import { useResponse } from "./useResponse";
import { Encryption } from "../utils/encryption";
import { ResponseCode } from "../models/application/enum";

interface CardFunction {
  onCardInfoSubmit: (
    state: CardState,
    app: State,
    current: number,
    request: any
  ) => void;
  onCardPinVerification: (
    state: CardState,
    value: any,
    current: number
  ) => void;
  onOtpVerification: (request: { otp: string }) => Promise<void>;
  onRemoveCard: (request: RemoveCard) => Promise<void>;
  onCardinalRedirection: () => Promise<void>;
  onResendOtp: (request: ResendOtp) => Promise<void>;
  state: CardState;
  mutateResult: any;
  savedCards: any;
  loading: boolean;
  formatCardNumber: (value: string) => string;
  onSaveCard: (app: State, state: CardState) => void;
  onUseSavedCardsVerification: (useSavedCardVerification: boolean) => void;
  onShowSavedCard: (request: { email: string }) => void;
  onSetField: (state: CardState, key: string, value: any) => void;
  validateCardType: (value: string, bin: Bin[]) => string;
  getCardTypeValue: (cardType: string) => void;
  validateExpiryDate: (cardExpiry: string) => boolean | string;
  handleExpiryDateChange: (
    form: FormInstance<any>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  cardNumberValidator: (_rule: any, value: any) => Promise<void>;
  cardImg: (value: string) => string;
  paymentInfo: PaymentInfo;
}

const useCard = (): CardFunction => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => {
    return state.card;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [mutate, mutateResult] = useMutateDataMutation();
  const [getSavedCards, savedCards] = useLazyGetDataQuery();
  const { onNotify } = useNotification();
  const [loading, setLoading] = useState(false);
  const { handleResponse } = useResponse();

  const cardRequest = useCallback(
    (app: State) => {
      return {
        callbackUrl: state.request?.callbackUrl
          ? state.request.callbackUrl
          : "",
        country: "Nigeria",
        paymentType: "Card",
        cardBrand: state.cardType,
        publicKey: "",
        token: null,
        currency: app.paymentInfo?.currency,
        email: app.paymentInfo?.email,
        entryType: "Frontend",
        firstName: app.request?.firstName ? app.request.firstName : "",
        lastName: app.request?.lastName ? app.request.lastName : "",
        metaData: app.paymentInfo?.metadata ? app.paymentInfo.metadata : "",
        phoneNumber: app.request?.phoneNumber ? app.request.phoneNumber : "",
        productDescription: app.paymentInfo?.productDescription
          ? app.paymentInfo?.productDescription
          : "",
        productId: app.paymentInfo?.productId ? app.paymentInfo?.productId : "",
        transactionId: app.paymentInfo?.transactionId,
        amount: `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
        accountName: app.request?.accountName ? app.request.accountName : "",
        accountNumber: app.request?.accountNumber
          ? app.request.accountNumber
          : "",
        narration: app.request?.narration
          ? app.request?.narration?.length > 0
            ? app.request.narration
            : "Paid " +
              `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}` +
              " to " +
              app.paymentInfo?.businessName +
              "for" +
              app.paymentInfo?.productId
          : "Paid " +
            `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}` +
            " to " +
            app.paymentInfo?.businessName +
            " for " +
            app.paymentInfo?.productId,
        bvn: app.request?.bvn ? app.request.bvn : "",
        isRecurring: app.paymentInfo?.isRecurring,
        deviceInformation,
        merchantId: app.paymentInfo?.merchantId,
      };
    },
    [state.cardType, state.request.callbackUrl]
  );

  const onCardInfoSubmit = useCallback(
    (state: CardState, app: State, current: number, request: any) => {
      dispatch(
        setAllCardState({
          ...state,
          current,
          request: {
            ...cardRequest(app),
            cardNumber: request.cardNumber?.replace(/\s/g, ""),
            expiryMonth: request.expiryDate?.split("/")[0],
            expiryYear: request.expiryDate?.split("/")[1],
            cvv: request?.cvv,
          },
        })
      );
    },
    [cardRequest, dispatch]
  );

  const onCardPinVerification = useCallback(
    async (state: CardState, request: any, current: number) => {
      request =
        app.paymentInfo?.currency?.toUpperCase() !== "NGN"
          ? {
              ...cardRequest(app),
              cardNumber: request.cardNumber?.replace(/\s/g, ""),
              expiryMonth: request.expiryDate?.split("/")[0],
              expiryYear: request.expiryDate?.split("/")[1],
              cvv: request?.cvv,
            }
          : {
              ...state.request,
              pin: request?.pin,
            };
      request = {
        payload: Encryption.encryptWithRequestKey(JSON.stringify(request)),
      };
      updatePaymentActivity(
        "User card details filled and initiating card payment",
        "Click",
        app
      );
      const response = await mutate({
        postUrl: endpoints.makePayment,
        request,
      });
      const apiResponse: MakePaymentResponse = response.error ?? response.data;
      if (apiResponse?.responseCode === "06") {
        updatePaymentActivity(
          "Card payment initiated successfully",
          "Response",
          app
        );
        dispatch(
          setAllCardState({
            ...state,
            current,
            MakePaymentResponse: apiResponse.data as MakePaymentResponseData,
          })
        );
      } else if (apiResponse?.responseCode === "07") {
        updatePaymentActivity(
          "App requesting user to complete payment on bank site",
          "Redirect",
          app
        );
        dispatch(
          setAllCardState({
            ...state,
            MakePaymentResponse: apiResponse.data as MakePaymentResponseData,
            showConsent: true,
          })
        );
      } else if (apiResponse?.responseCode === "11") {
        updatePaymentActivity(
          "App requesting user to complete payment on bank site",
          "Redirect",
          app
        );
        dispatch(
          setAllCardState({
            ...state,
            MakePaymentResponse: apiResponse.data as MakePaymentResponseData,
            showMasterCardInternational: true,
            showConsent: true,
            current: 1,
          })
        );
      } else if (apiResponse?.responseCode === ResponseCode.SUCCESS) {
        updatePaymentActivity("Card payment successful", "Response", app);
        ApiResponseHandle.successResponse(app, {
          ...apiResponse,
          transactionId: app.paymentInfo?.transactionId,
        });
      } else {
        if (response.error) {
          let errorMessage = "Error occurred on server. Please try again";
          const error: BaseQueryErrorResponse =
            response.error as BaseQueryErrorResponse;
          if (error?.status && error.status === 400) {
            errorMessage = generateBadRequestErrorMessage(response.error);
          }
          updatePaymentActivity(errorMessage, "Error", app);
          ApiResponseHandle.errorResponse(
            app,
            error.data?.responseCode,
            errorMessage,
            { transactionId: app.paymentInfo?.transactionId }
          );
        } else {
          ApiResponseHandle.errorResponse(
            app,
            apiResponse?.responseCode,
            apiResponse?.responseMessage ?? "",
            { transactionId: app.paymentInfo?.transactionId }
          );
        }
      }
    },
    [app, cardRequest, dispatch, mutate]
  );

  const onCardinalRedirection = useCallback(async () => {
    if (state.showMasterCardInternational) {
      updatePaymentActivity(
        "User redirected to Master card to complete payment",
        "Redirect",
        app
      );
      dispatch(
        setAppState({
          key: "hideCard",
          value: true,
        })
      );
    } else {
      updatePaymentActivity(
        "User redirected to InterSwitch to complete payment",
        "Redirect",
        app
      );
      setLoading(true);
      dispatch(setCardState({ key: "redirectType", value: "interSwitch" }));
      setLoading(false);
      const form = document.createElement("form");
      form.method = "POST";
      form.action = state.MakePaymentResponse?.authUrl as string;

      const fields: any = {
        TermUrl:
          API_BASE_URL +
          endpoints.cardinalCallback +
          `${app.paymentInfo?.transactionId}/${app.paymentInfo?.merchantId}`,
        MD: state.MakePaymentResponse?.md,
        PaReq: state.MakePaymentResponse?.payloadContent ?? "",
        JWT: state.MakePaymentResponse?.jwt,
      };

      Object.keys(fields).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      setLoading(false);
    }
  }, [
    app.paymentInfo?.merchantId,
    app.paymentInfo?.transactionId,
    state.MakePaymentResponse?.authUrl,
    state.MakePaymentResponse?.jwt,
    state.MakePaymentResponse?.md,
    state.MakePaymentResponse?.payloadContent,
    state.showMasterCardInternational,
  ]);

  const onOtpVerification = useCallback(
    async (request: { otp: string }) => {
      try {
        const response = await mutate({
          postUrl: endpoints.validatePayment,
          request: {
            providerReference:
              state.MakePaymentResponse?.providerReference ?? "",
            transactionId: app.paymentInfo.transactionId,
            entryType: "Frontend",
            otp: request?.otp,
          },
        });
        const apiResponse = response.error ?? response.data;
        if (apiResponse.responseCode === ResponseCode.SUCCESS) {
          updatePaymentActivity(
            "OTP verified and payment successful",
            "Verification",
            app
          );
          ApiResponseHandle.successResponse(app, {
            ...apiResponse,
            transactionId: app.paymentInfo?.transactionId,
          });
        } else {
          updatePaymentActivity(apiResponse?.responseMessage, "Error", app);
          if (response.error) {
            let errorMessage = "Error occurred on server. Please try again";
            const error: BaseQueryErrorResponse =
              response.error as BaseQueryErrorResponse;
            if (error?.status && error.status === 400) {
              errorMessage = generateBadRequestErrorMessage(response.error);
            }
            updatePaymentActivity(errorMessage, "Error", app);
            ApiResponseHandle.errorResponse(
              app,
              error.data?.responseCode,
              errorMessage,
              {
                responseCode: error.data?.responseCode,
                transactionId: app.paymentInfo?.transactionId,
              }
            );
          } else {
            ApiResponseHandle.errorResponse(
              app,
              apiResponse?.responseCode,
              apiResponse?.responseMessage ?? "",
              {
                transactionId: app.paymentInfo?.transactionId,
              }
            );
          }
        }
      } catch (error) {
        onNotify(
          "error",
          "Error occured",
          "Something went wrong try again  later."
        );
      }
    },
    [
      app,
      mutate,
      onNotify,
      state.MakePaymentResponse?.providerReference,
      state.MakePaymentResponse?.transactionId,
    ]
  );

  const formatCardNumber = useCallback((value: string) => {
    const cleanedValue = value.replace(/\D+/g, ""); // Remove all non-numeric characters
    const formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits
    return formattedValue.trim();
  }, []);

  const onSaveCard = useCallback(
    async (app: State, state: CardState) => {
      if (
        state.request.cardNumber &&
        state.request.expiryDate &&
        state.request.cvv
      ) {
        const request = {
          email: app.paymentInfo.email,
          cardPan: state.request.cardNumber.replace(/\s/g, ""),
          expiryMonth: state.request.expiryDate?.split("/")[0],
          expiryYear: state.request.expiryDate?.split("/")[1],
          cvv: state.request.cvv,
          cardBrand: state.cardType,
        };
        const encryptedRequest = Encryption.encryptWithRequestKey(
          JSON.stringify(request)
        );
        const response = await mutate({
          postUrl: endpoints.saveCard,
          request: { payload: encryptedRequest },
        });
        handleResponse(response, false, (responseData) => {
          updatePaymentActivity("Saved card", "Click", app);
          dispatch(
            setCardState({
              key: "shouldRemeberCard",
              value: true,
            })
          );
          dispatch(
            setCardState({
              key: "apiResponse",
              value: responseData,
            })
          );
        });
      }
    },
    [dispatch, mutate]
  );

  const onUseSavedCardsVerification = useCallback(
    (useSavedCardVerification: boolean) => {
      sessionStorage.removeItem("savedCardEmail");
      dispatch(
        setCardState({
          key: "useSavedCardVerification",
          value: useSavedCardVerification,
        })
      );
      dispatch(
        setCardState({
          key: "showSavedCards",
          value: false,
        })
      );
    },
    [dispatch]
  );

  const onShowSavedCard = useCallback(
    async (request: { email: string }) => {
      const response = await getSavedCards({
        getUrl: endpoints.getSavedCards + request.email,
      });
      handleResponse<{ payload: string }>(response, true, (responseData) => {
        const data = Encryption.decryptWithResponseKey(responseData?.payload);
        try {
          dispatch(
            setAllCardState({
              ...state,
              savedCards: JSON.parse(data ?? "[]") as SavedCards[],
              showSavedCards: true,
            })
          );
        } catch {}
      });
    },
    [dispatch, getSavedCards, onNotify, state]
  );

  const validateCardType = useCallback(
    (value: string, bin: Bin[]): CardTypes => {
      const cardNumber = value.replace(/\s/g, "");
      if (parseInt(cardNumber?.trim()?.slice(0, 4)) === 5640) {
        return CardTypes.AFRIGROBAL;
      }
      // Check if the card number matches any BIN in the provided BIN array
      for (const cardBin of bin) {
        // Extract the relevant section of the card number for comparison (based on Min/Max PAN length)
        const cardPrefix = cardNumber.slice(
          0,
          cardBin.BinRangeMinimum.toString().length
        );

        // Check if the card prefix falls within the BIN range
        if (
          parseInt(cardPrefix) >= cardBin.BinRangeMinimum &&
          parseInt(cardPrefix) <= cardBin.BinRangeMaximum &&
          cardNumber.length >= cardBin.MinPanLength &&
          cardNumber.length <= cardBin.MaxPanLength
        ) {
          switch (cardBin.Name) {
            case "VISA":
              return CardTypes.VISA;
            case "MASTERCARD":
              return CardTypes.MASTERCARD;
            case "VERVE":
              return CardTypes.VERVE;
            case "AMERICAN EXPRESS":
              return CardTypes.AMERICAN_EXPRESS;
            case "DINERS CLUB":
              return CardTypes.DINERS_CLUB;
            case "JCB":
              return CardTypes.JCB;
            case "DISCOVER":
              return CardTypes.DISCOVER;
            case "MAESTRO":
              return CardTypes.MAESTRO;
            // Add additional cases if necessary
            default:
              return CardTypes.NOT_FOUND;
          }
        }
      }

      // If no match is found, return NOT_FOUND
      return CardTypes.NOT_FOUND;
    },
    []
  );

  const getCardTypeValue = useCallback(
    (cardType: string) => {
      dispatch(
        setCardState({
          key: "cardType",
          value: cardType,
        })
      );
    },
    [dispatch]
  );

  const validateAndFormatExpiryDate = (cardExpiry: string): string => {
    const formattedExpiry = cardExpiry
      .replace(/[^0-9]/g, "") // Allow only numbers
      .replace(/^([2-9])$/g, "0$1") // 3 > 03
      .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2") // 13 > 01/3
      .replace(/^0{1,}/g, "0") // 00 > 0
      .replace(/^([0-1]{1}[0-9]{1})([0-9]{2,4})$/g, "$1/$2"); // 113 > 11/3 or 2023 > 11/2023

    return formattedExpiry.length > 2 && !formattedExpiry.includes("/")
      ? formattedExpiry.slice(0, 2) + "/" + formattedExpiry.slice(2)
      : formattedExpiry;
  };

  const validateExpiryDate = (cardExpiry: string): boolean | string => {
    const formattedExpiry = validateAndFormatExpiryDate(cardExpiry);
    const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!regex.test(formattedExpiry)) {
      return false;
    }

    const [, year] = formattedExpiry.split("/");
    const currentYear = new Date().getFullYear() % 100;

    if (parseInt(year, 10) < currentYear) {
      return "The card has expired!";
    }

    return true;
  };

  const handleExpiryDateChange = (
    form: FormInstance<any>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const formattedValue = validateAndFormatExpiryDate(value);
    form.setFieldsValue({ expiryDate: formattedValue });
    dispatch(
      setCardState({
        key: "request",
        value: {
          ...state.request,
          expiryDate: formattedValue,
        },
      })
    );
  };

  const onSetField = useCallback(
    (state: CardState, key: string, value: any) => {
      if (key === "cardNumber") {
        const cardNumber = formatCardNumber(value);
        dispatch(
          setAllCardState({
            ...state,
            request: {
              ...state.request,
              cardNumber,
            },
          })
        );
      } else {
        dispatch(
          setAllCardState({
            ...state,
            request: {
              ...state.request,
              [key]: value,
            },
          })
        );
      }
    },
    [dispatch, formatCardNumber]
  );

  const getCardNumberMaxLength = useCallback((cardType: CardTypes) => {
    switch (cardType) {
      case "mastercard":
      case "visa":
        return 19;
      case "verve":
        return 23;
      case "afriglobal":
        return 22;
      default:
        return 24;
    }
  }, []);

  const cardNumberValidator = (_rule: any, value: any): Promise<void> => {
    // Check if value is null, undefined, or not a string
    if (!value || typeof value !== "string" || value.trim() === "") {
      return Promise.resolve(); // Do nothing if the value is empty
    }

    // Remove spaces from the card number
    const formattedValue = value.replace(/\s+/g, "");

    // Validate the card type
    const result: CardTypes = validateCardType(
      formattedValue,
      app.paymentInfo?.currency?.toUpperCase() === "NGN" ? BIN.Bin : BIN.Int_Bin
    );
    if (result === "") {
      getCardTypeValue(result);
      return Promise.reject(new Error("Invalid card number"));
    }
    getCardTypeValue(result);

    //Check the length after removing spaces
    if (value?.length === getCardNumberMaxLength(result)) {
      const nextEle = document.getElementById(
        "expiry"
      ) as HTMLInputElement | null;
      nextEle?.focus();
    }
    return Promise.resolve();
  };

  const onRemoveCard = useCallback(
    async (request: RemoveCard) => {
      const apiRequest = {
        payload: Encryption.encryptWithRequestKey(JSON.stringify(request)),
      };
      try {
        const response = await mutate({
          ...state,
          postUrl: endpoints.removeCard,
          request: apiRequest,
        });
        const apiResponse: API<any> = response.error ?? response.data;
        if (apiResponse?.responseCode === ResponseCode.SUCCESS) {
          onNotify("success", "Successful", apiResponse?.responseMessage);
          onShowSavedCard({ email: app.paymentInfo?.email });
        } else {
          onNotify("error", "Error occured", apiResponse?.responseMessage);
        }
      } catch (error) {
        onNotify("error", "Error occured", "Something went wrong");
      }
    },
    [app.paymentInfo?.email, mutate, onNotify, onShowSavedCard, state]
  );

  const onResendOtp = useCallback(
    async (request: ResendOtp) => {
      try {
        const response = await mutate({
          ...state,
          postUrl: endpoints.resendOtp,
          request,
        });
        const apiResponse: API<any> = response.error ?? response.data;
        if (apiResponse?.responseCode === ResponseCode.SUCCESS) {
          onNotify("success", "Successful", apiResponse?.responseMessage);
        } else {
          onNotify(
            "error",
            "Error occured",
            apiResponse?.responseMessage || apiResponse?.data?.responseMessage
          );
        }
      } catch (error) {
        onNotify("error", "Error occured", "Something went wrong try again.");
      }
    },
    [mutate, onNotify, state]
  );

  const cardImg = useCallback((value: string) => {
    return value === CardTypes.MASTERCARD
      ? mastercard
      : value === CardTypes.VISA
      ? visa
      : value === CardTypes.VERVE
      ? verve
      : value === CardTypes.AMERICAN_EXPRESS
      ? amex
      : value === CardTypes.DINERS_CLUB
      ? diner
      : value === CardTypes.JCB
      ? jcb
      : value === CardTypes.DISCOVER
      ? discover
      : value === CardTypes.MAESTRO
      ? maestro
      : value === CardTypes.AFRIGROBAL
      ? afrigo
      : "";
  }, []);

  return {
    onCardInfoSubmit,
    onCardPinVerification,
    formatCardNumber,
    onSaveCard,
    onUseSavedCardsVerification,
    onShowSavedCard,
    onSetField,
    validateCardType,
    getCardTypeValue,
    validateExpiryDate,
    handleExpiryDateChange,
    cardNumberValidator,
    onOtpVerification,
    onCardinalRedirection,
    onRemoveCard,
    onResendOtp,
    cardImg,
    state,
    mutateResult,
    paymentInfo: app.paymentInfo,
    savedCards,
    loading,
  };
};

export default useCard;
