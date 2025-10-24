import { Form } from "antd";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ResponseCode } from "../models/application/enum";
import {
  BaseQueryErrorResponse,
  MakePaymentResponse,
  WalletAuthentication,
} from "../models/client/response";
import { setAllWalletState } from "../store";
import { useMutateDataMutation } from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import { useAppSelector } from "../store/hooks";
import { Encryption } from "../utils/encryption";
import {
  ApiResponseHandle,
  deviceInformation,
  generateBadRequestErrorMessage,
  updatePaymentActivity,
} from "../utils/helper";
import useSubmittable from "./useSubmittable";

export const useWallet = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { disabled } = useSubmittable(form);
  const [mutate, mutateResult] = useMutateDataMutation();
  const state = useAppSelector((state) => {
    return state.wallet;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });

  const onCancel = useCallback(() => {
    dispatch(
      setAllWalletState({
        ...state,
        pageType: "authenticate",
      })
    );
  }, []);

  const onAuthenticate = useCallback(async () => {
    if (state.request) {
      const request = {
        payload: Encryption.encryptWithRequestKey(
          JSON.stringify(state.request)
        ),
      };
      const response = await mutate({
        postUrl: endpoints.Login,
        request,
      });
      if (response?.data?.responseCode === ResponseCode.SUCCESS) {
        const data: WalletAuthentication = response?.data?.data;
        dispatch(
          setAllWalletState({
            ...state,
            isLoginError: false,
            details: data,
            pageType: "wallet_details",
          })
        );
      } else if (response?.error) {
        const error: BaseQueryErrorResponse =
          response.error as BaseQueryErrorResponse;
        dispatch(
          setAllWalletState({
            ...state,
            isLoginError: true,
            loginErrorMessage:
              error?.data?.responseMessage ??
              "Sorry, error occurred on the server. Please try again",
          })
        );
      } else if (response?.data?.responseCode !== ResponseCode.SUCCESS) {
        dispatch(
          setAllWalletState({
            ...state,
            isLoginError: true,
            loginErrorMessage: response?.data?.responseMessage,
          })
        );
      }
    }
  }, [state.request]);

  const onConfirmPayment = useCallback(() => {
    dispatch(
      setAllWalletState({
        ...state,
        isLoginError: false,
        pageType: "pin",
      })
    );
  }, [state, dispatch]);

  const onVerifyPayment = useCallback(() => {
    dispatch(
      setAllWalletState({
        ...state,
        isLoginError: false,
        pageType: "confirm_payment",
      })
    );
  }, [state, dispatch]);

  const onMakePayment = useCallback(async () => {
    const payload = {
      callbackUrl: app.paymentInfo?.callbackUrl ?? "",
      country: "Nigeria",
      paymentType: "Wallet",
      pin: state?.pin,
      cardBrand: "",
      publicKey: "",
      token: state?.details?.token,
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
    const request = {
      payload: Encryption.encryptWithRequestKey(JSON.stringify(payload)),
    };
    updatePaymentActivity("User making payment via wallet", "Click", app);
    const response = await mutate({
      postUrl: endpoints.makePayment,
      request,
    });
    const apiResponse: MakePaymentResponse = response.error ?? response.data;
    if (apiResponse?.responseCode === ResponseCode.SUCCESS) {
      updatePaymentActivity("Wallet payment successful", "Response", app);
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
  }, [app, state]);

  const onSetField = useCallback(
    (key: string, value: any) => {
      dispatch(
        setAllWalletState({
          ...state,
          request: {
            ...state.request,
            [key]: value,
          },
        })
      );
    },
    [dispatch, state?.request]
  );
  const onSetPin = useCallback(
    (pin: string) => {
      if (pin) {
        dispatch(
          setAllWalletState({
            ...state,
            pin,
          })
        );
      }
    },
    [dispatch]
  );

  const isInsufficient = useMemo(() => {
    if (state?.details && app?.selectedPaymentMethod?.totalAmount) {
      return (
        state?.details?.balance < (app?.selectedPaymentMethod?.totalAmount ?? 0)
      );
    } else {
      return true;
    }
  }, [state?.details, app?.selectedPaymentMethod?.totalAmount]);

  return {
    form,
    disabled,
    onSetField,
    onAuthenticate,
    onConfirmPayment,
    onMakePayment,
    onVerifyPayment,
    onSetPin,
    processing: mutateResult.isLoading,
    details: state?.details,
    isInsufficient,
    errorMessage: state.loginErrorMessage,
    isLoginError: state.isLoginError,
    onCancel,
    buttonColor: app.paymentInfo?.customization?.buttonColor,
    textColorColor: app.paymentInfo?.customization?.buttonColor,
  };
};
