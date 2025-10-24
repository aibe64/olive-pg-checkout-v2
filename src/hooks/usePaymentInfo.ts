import { useCallback } from "react";
import { useLazyGetDataQuery } from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import { useAppDispatch } from "../store/hooks";
import {
  API,
  BaseQueryErrorResponse,
  PaymentInfo,
} from "../models/client/response";
import { setAllAppState, setAppState } from "../store";
import { ApiResponseHandle } from "../utils/helper";
import { State } from "../models/application/state";
import { Encryption } from "../utils/encryption";
import { ResponseCode } from "../models/application/enum";

interface PaymentInfoFunction {
  onPaymentInfo: (state: State, accessCode: string) => Promise<void>;
  paymentInfoResult: any;
}

const usePaymentInfo = (): PaymentInfoFunction => {
  const dispatch = useAppDispatch();
  const [getPaymentInfo, paymentInfoResult] = useLazyGetDataQuery();

  const onPaymentInfo = useCallback(
    async (state: State, accessCode: string) => {
      try {
        const response = await getPaymentInfo({
          getUrl: endpoints.getPaymentInfo + accessCode,
        });
        if (response.data) {
          const apiResponse: API<PaymentInfo> = response.data;
          if (apiResponse?.responseCode === ResponseCode.ALREADY_STARTED) {
            switch (apiResponse.data?.stage) {
              case 1:
                const encrytpedToken = Encryption.encrypt(
                  apiResponse?.data?.token as string
                );
                const encrytpedPublickey = Encryption.encrypt(
                  apiResponse?.data?.publicKey as string
                );
                localStorage.setItem("********", encrytpedToken);
                dispatch(
                  setAllAppState({
                    ...state,
                    token: encrytpedToken,
                    publicKey: encrytpedPublickey,
                    paymentInfo: apiResponse?.data as PaymentInfo,
                  })
                );
                break;
              default:
                ApiResponseHandle.errorResponse(
                  state,
                  apiResponse?.responseCode ?? apiResponse?.status,
                  apiResponse?.responseMessage ?? apiResponse?.error,
                  {
                    transactionId: state?.paymentInfo?.transactionId,
                  }
                );
                break;
            }
          } else if (apiResponse?.responseCode !== ResponseCode.SUCCESS) {
            ApiResponseHandle.errorResponse(
              state,
              apiResponse?.responseCode ?? apiResponse?.status,
              apiResponse?.responseMessage ?? apiResponse?.error,
              {
                transactionId: state?.paymentInfo?.transactionId,
              }
            );
          } else {
            const encrytpedToken = Encryption.encrypt(
              apiResponse?.data?.token as string
            );
            const encrytpedPublickey = Encryption.encrypt(
              apiResponse?.data?.publicKey as string
            );
            localStorage.setItem("********", encrytpedToken);
            dispatch(
              setAllAppState({
                ...state,
                token: encrytpedToken,
                publicKey: encrytpedPublickey,
                paymentInfo: apiResponse?.data as PaymentInfo,
              })
            );
          }
        } else if (response.error) {
          const error: BaseQueryErrorResponse =
            response.error as BaseQueryErrorResponse;
          if (error) {
            // const {data} = {
            //   data: {
            //     email: "HERE@THERE.COM",
            //     amount: "250.00",
            //     transactionId: "102224",
            //     link: "https://pgsandbox.xpresspayments.com:6003/h0wOk9G05FFI22X",
            //     reference: null,
            //     businessName: "XPRESS PAYMENT",
            //     isActive: true,
            //     cardPayment: true,
            //     accountPayment: true,
            //     ussdPayment: true,
            //     qrPayment: true,
            //     eNaira: false,
            //     receiveInternationalPayment: false,
            //     walletPayment: false,
            //     bankTransferPayment: true,
            //     logo: null,
            //     webHookUrl: null,
            //     token:
            //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNjg3ZDg2NC03NDBkLTQ1Y2MtOGVlYy01NzFhOTVkNTk4MTUiLCJlbWFpbCI6InRhbGsycGhhc2Foc3lAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlhQUFVCSy0zQzBCQjcxRUFBQzI0ODUwQjc3N0NENjcyQzIyM0JCQy1YIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGFsazJwaGFzYWhzeUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE4MTAyMjI0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvaGFzaCI6IiIsIk1JRCI6IjE4IiwiZXhwIjoxNzQ3OTUxNTkzLCJpc3MiOiJteVZhbHVlIiwiYXVkIjoiamRzayJ9.0OAZoNHeinBZnHnrSYpaQhOOdj28c5nb_pWsN6QciKg",
            //     currency: "NGN",
            //     callbackUrl: null,
            //     metadata: "null",
            //     transactionHistoryId: 0,
            //     merchantId: 18,
            //     productId: null,
            //     productDescription: null,
            //     totalAmount: "253.00",
            //     isChargeTransferedToCustomer: false,
            //     isPaymentPageCustomizationEnabled: false,
            //     customization: {
            //       bodyColor: "#FFC300",
            //       buttonColor: "#900C3F",
            //       footerText: "WE ARE DOING SOME TESTING HERE",
            //       footerLink: "THIS IS A LINK",
            //       footerLogo: "",
            //     },
            //     isRecurring: false,
            //     paymentType: "Transfer",
            //     stage: 1,
            //   },
            // };
            // const encrytpedTokens = Encryption.encrypt(
            //   data?.token as string
            // );
            // localStorage.setItem("********", encrytpedTokens);
            // dispatch(
            //   setAllAppState({
            //     ...state,
            //     token: encrytpedTokens,
            //     paymentInfo: data as any,
            //   })
            // );
            ApiResponseHandle.errorResponse(
              state,
              error.data?.responseCode ?? error.status,
              error.data?.responseMessage ??
                "Kindly initialize payment from the merchant. Please go back and try again.",
                {
                  transactionId: state?.paymentInfo?.transactionId,
                }
            );
          }
        }
      } catch (error) {
        dispatch(
          setAppState({
            key: "showResponsePage",
            value: true,
          })
        );
        dispatch(
          setAppState({
            key: "apiResponse",
            value: {
              responseCode: "12",
              responseMessage:
                "Kindly initialize payment from the merchant Please go back and try again.",
            },
          })
        );
      }
    },
    [dispatch, getPaymentInfo]
  );

  return {
    onPaymentInfo,
    paymentInfoResult,
  };
};

export default usePaymentInfo;
