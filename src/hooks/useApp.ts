/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import useMenuItems from "./useMenuItems";
import usePaymentInfo from "./usePaymentInfo";
import useToggle from "./useToggle";
import { State } from "../models/application/state";
import { useLazyGetDataQuery } from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import { ApiResponseHandle, updatePaymentActivity } from "../utils/helper";
import {
  API,
  BaseQueryErrorResponse,
  BaseQueryResponse,
  VerifyPayment,
} from "../models/client/response";
import { ResponseCode } from "../models/application/enum";
import { useDispatch } from "react-redux";
import { setAppState } from "../store";

export interface AppFunction {
  onCancel: () => void;
  items: any[];
  onCurrentChange: (state: State) => void;
  paymentInfoResult: any;
  hoverColor: string;
  setHoverColor: any;
  showPage: boolean;
  setShowPage: any;
  state: State;
}

const useApp = (fetchPaymentInfoAPIOnRender: boolean) => {
  const state: State = useAppSelector((state) => {
    return state.app;
  });
  const dispatch = useDispatch();

  const items = useMenuItems();
  // const [showPage, setshowPage] = useState(false);
  const [hoverColor, setHoverColor] = useState("#656565");
  const { onCurrentChange } = useToggle();
  const { onPaymentInfo, paymentInfoResult } = usePaymentInfo();
  const [verifyPayment, result] = useLazyGetDataQuery();
  const [reValidatePayment] = useLazyGetDataQuery();

  // useEffect(() => {
  //   const verificationCode = window.location.href.split("/")[4];
  //   const handleMessage = (event: any) => {
  //     if (verificationCode && event.origin !== window.location.origin) {
  //       setTimeout(() => {
  //         dispatch(
  //           setAppState({
  //             key: "hideCard",
  //             value: false,
  //           })
  //         );
  //         dispatch(
  //           setCardState({
  //             key: "current",
  //             value: 3,
  //           })
  //         );
  //       }, 500);
  //     }
  //   };
  //   window.addEventListener("message", handleMessage);
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, []);

  const setshowPage = useCallback(
    (showPage: boolean) => {
      dispatch(
        setAppState({
          key: "showPaymentPage",
          value: showPage,
        })
      );
    },
    [setAppState]
  );

  const getPaymentInfoByTranId = useCallback(
    async (verificationCode: string, merchantId: string) => {
      try {
        const response: BaseQueryResponse = await verifyPayment({
          ...state,
          getUrl: `${endpoints.GetPaymentInfoByTranId}${verificationCode}/${merchantId}`,
        });
        if (response?.data) {
          const apiResponse: API<VerifyPayment> = response.data;
          if (apiResponse?.responseCode === ResponseCode.SUCCESS) {
            const data = apiResponse.data;
            ApiResponseHandle.successResponse(
              {
                ...state,
                paymentInfo: {
                  ...state?.paymentInfo,
                  callbackUrl: data?.callBackUrl,
                  amount: data?.amount as string,
                  transactionId: data?.transactionId as string,
                },
              },
              {
                ...apiResponse,
                transactionId: state.paymentInfo?.transactionId,
              }
            );
          }
        } else if (response?.error) {
          const error: BaseQueryErrorResponse =
            response.error as BaseQueryErrorResponse;
          ApiResponseHandle.errorResponse(
            state,
            error.data?.responseCode ?? error.status,
            error.data?.responseMessage,
            {
              transactionId: state?.paymentInfo?.transactionId,
            }
          );
        }
      } catch (error) {
        ApiResponseHandle.errorResponse(
          state,
          "02",
          "Something went wrong with payment verification",
          {
            message: "There was an issue verifying the payment made",
            transactionId: state?.paymentInfo?.transactionId,
          }
        );
      }
    },
    []
  );

  useEffect(() => {
    const verificationCode = window.location.href.split("/")[4];
    const merchantId = window.location.href.split("/")[5];
    const accessCode = window.location.href.split("/")[3];
    if (verificationCode && merchantId) {
      getPaymentInfoByTranId(verificationCode, merchantId);
    } else if (fetchPaymentInfoAPIOnRender && !state.paymentInfo.amount) {
      onPaymentInfo(state, accessCode);
    }
  }, [
    getPaymentInfoByTranId,
    onPaymentInfo,
    fetchPaymentInfoAPIOnRender,
    state.paymentInfo?.amount,
  ]);

  const onCancel = useCallback(() => {
    updatePaymentActivity("Customer closed page", "Close", state);
    reValidatePayment({
      getUrl: endpoints.ReValidatePayment,
    });
    if (state?.responseOnClick) {
      state.responseOnClick();
    }
    if (state.paymentInfo.callbackUrl && window.self === window.parent) {
      window.location.replace(state.paymentInfo.callbackUrl);
    } else if (
      state.paymentInfo?.callbackUrl &&
      window.self !== window.parent
    ) {
      let url = state.paymentInfo.callbackUrl;
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
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          eventType: "closeIframe",
        })
      );
      window.parent.postMessage("closeIframe", "*");
    } else {
      window.history.back();
    }
    sessionStorage.clear();
  }, [state?.responseOnClick, state?.paymentInfo?.callbackUrl, state]);

  return {
    onCancel,
    items,
    onCurrentChange,
    paymentInfoResult,
    hoverColor,
    setHoverColor,
    showPage: state.showPaymentPage,
    setshowPage,
    state,
    paymentVerificationResult: result,
    dispatch,
    setAppState,
  };
};

export default useApp;
