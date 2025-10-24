import { useCallback } from "react";
import { ResponseCode } from "../models/application/enum";
import {
  API,
  BaseQueryErrorResponse,
  BaseQueryResponse,
} from "../models/client/response";
import { setAllAppState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  ApiResponseHandle,
  generateBadRequestErrorMessage,
  updatePaymentActivity,
} from "../utils/helper";

export const useResponse = () => {
  const state = useAppSelector((state) => {
    return state.app;
  });
  const dispatch = useAppDispatch();

  const handleResponse = useCallback(
    <T>(
      response: BaseQueryResponse,
      showErrorPage: boolean,
      onSuccessCallBack: (data: T | { payload: string }) => void,
      customSuccessCode?: string
    ) => {
      if (response.data) {
        const apiResponse: API<T | { payload: string }> = response.data;
        if (apiResponse?.responseCode === customSuccessCode) {
          onSuccessCallBack(apiResponse.data ?? { payload: "" });
        } else if (apiResponse?.responseCode !== ResponseCode.SUCCESS) {
          if (showErrorPage) {
            updatePaymentActivity(apiResponse?.responseMessage, "Error", state)
            ApiResponseHandle.errorResponse(
              state,
              apiResponse?.responseCode,
              apiResponse?.responseMessage,
              {
                transactionId: state?.paymentInfo?.transactionId,
              }
            );
          } else {
            dispatch(
              setAllAppState({
                ...state,
                showErrorAlert: true,
                responseDescription: apiResponse?.responseMessage,
              })
            );
          }
        } else {
          onSuccessCallBack(apiResponse.data ?? { payload: "" });
        }
      } else if (response.error) {
        let errorMessage = "Error occurred on server. Please try again";
        const error: BaseQueryErrorResponse =
          response.error as BaseQueryErrorResponse;
        if (showErrorPage) {
          if (error?.status && error.status === 400) {
            errorMessage = generateBadRequestErrorMessage(response.error);
          }
          updatePaymentActivity(errorMessage, "Error", state)
          ApiResponseHandle.errorResponse(
            state,
            error.data?.responseCode,
            errorMessage,
            {
              transactionId: state?.paymentInfo?.transactionId,
            }
          );
        } else {
          if (error?.status && error.status === 400) {
            errorMessage = generateBadRequestErrorMessage(response.error);
          }
          updatePaymentActivity(errorMessage, "Error", state)
          dispatch(
            setAllAppState({
              ...state,
              showErrorAlert: true,
              responseDescription: errorMessage,
            })
          );
        }
      }
    },
    [state]
  );

  return {
    handleResponse,
  };
};
