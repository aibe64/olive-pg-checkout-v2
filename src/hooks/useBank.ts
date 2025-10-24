import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAllBankState, setAppState } from "../store";
import {
  useLazyGetDataQuery,
  useMutateDataMutation,
} from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import {
  API,
  BankAccountValidation,
  BaseQueryErrorResponse,
  GetBanksForPayment,
  MakePaymentResponse,
  PaymentInfo,
} from "../models/client/response";
import { Form, FormInstance } from "antd";
import useSubmittable from "./useSubmittable";
import { MakePayment, ValidateBankAccount } from "../models/client/request";
import useNotification from "./useNotification";
import { ApiResponseHandle, deviceInformation } from "../utils/helper";
import { Encryption } from "../utils/encryption";
import { ResponseCode } from "../models/application/enum";

interface BankFunction {
  onVerifyAccount: (request: ValidateBankAccount) => void;
  onProceedToPay: (request: { otp: string }) => void;
  onAccountVerification: (accountNumber: string) => void;
  onSetFieldRequest: (key: keyof ValidateBankAccount, value: string) => void;
  proceedToOtpVerification: (request: MakePayment) => void;
  dataSource: Array<{
    label: string;
    value: string;
  }>;
  loading: boolean;
  disabled: boolean;
  form: FormInstance;
  validating: boolean;
  processing: boolean;
  paymentInfo: PaymentInfo;
}

const useBank = (): BankFunction => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => {
    return state.bank;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [getBanksForPayment, bankForPaymentResult] = useLazyGetDataQuery();
  const [proceedToPay, proceedToPayResult] = useMutateDataMutation();
  const [validateBankAccountForPayment, validateBankAccountResult] =
    useMutateDataMutation();
  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);
  const { onNotify } = useNotification();

  useEffect(() => {
    getBanksForPayment({
      getUrl: endpoints.getBanksForPayment,
    });
  }, [getBanksForPayment]);

  const dataSource: Array<{ label: string; value: string }> = Array.isArray(
    bankForPaymentResult.data?.data
  )
    ? bankForPaymentResult.data?.data?.map((item: GetBanksForPayment) => ({
        ...item,
        label: item.bankName,
        value: item.bankCode,
      }))
    : [];

  const onVerifyAccount = useCallback(
    async (request: ValidateBankAccount) => {
      try {
        const response = await validateBankAccountForPayment({
          postUrl: endpoints.validateUserAccount,
          request,
        });
        const apiResponse: API<BankAccountValidation> =
          response.error ?? response.data;
        if (apiResponse.responseCode !== ResponseCode.SUCCESS) {
          dispatch(
            setAllBankState({
              ...state,
              apiResponse,
            })
          );
        } else {
          dispatch(
            setAllBankState({
              ...state,
              apiResponse,
              request: {
                ...state.request,
                accountName: apiResponse?.data?.accountName,
              },
            })
          );
        }
      } catch (error) {
        onNotify("error", "Error occured", "Something went wrong");
      }
    },
    [dispatch, onNotify, state, validateBankAccountForPayment]
  );

  const onProceedToPay = useCallback(
    async (request: { otp: string }) => {
      try {
        let data = {
          transactionId: app.paymentInfo?.transactionId,
          paymentType: "Account",
          accountNumber: state.request?.accountNumber,
          accountName: state.request?.accountName,
          bankCode: state.request?.bankCode,
          deviceInformation,
          amount: `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
          email: app.paymentInfo?.email,
          merchantId: app.paymentInfo?.merchantId,
          country: "Nigeria",
          currency: "NGN",
          token: request.otp,
          productDescription: app.paymentInfo?.productDescription,
          productId: app.paymentInfo?.productId,
          metaData: app.paymentInfo?.metadata,
          entryType: "Frontend",
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
        };
        const apiRequest = {
          payload: Encryption.encryptWithRequestKey(JSON.stringify(data)),
        };
        const response = await proceedToPay({
          postUrl: endpoints.makePayment,
          request: apiRequest,
        });
        const apiResponse: MakePaymentResponse = response.data;
        const apiError: BaseQueryErrorResponse =
          response.error as BaseQueryErrorResponse;
        if (apiResponse && apiResponse.responseCode !== ResponseCode.SUCCESS) {
          ApiResponseHandle.errorResponse(
            app,
            apiResponse?.responseCode,
            apiResponse?.responseMessage ||
              "Unable to complete payment at this time, try again later",
            apiResponse
          );
          dispatch(
            setAppState({
              key: "showResponsePage",
              value: true,
            })
          );
        } else if (
          apiResponse &&
          apiResponse.responseCode === ResponseCode.SUCCESS
        ) {
          onNotify("success", "Successful", apiResponse.responseMessage);
        } else if (apiError) {
          ApiResponseHandle.errorResponse(
            app,
            apiError?.data?.responseCode ?? apiError.status,
            apiError?.data?.responseMessage ??
              "Unable to complete payment at this time, try again later",
            {}
          );
        }
      } catch (error) {
        onNotify(
          "error",
          "Error occured",
          "Something went wrong, try again later"
        );
      }
    },
    [app, dispatch, onNotify, proceedToPay, state]
  );

  const onSetFieldRequest = useCallback(
    (key: keyof ValidateBankAccount, value: string) => {
      dispatch(
        setAllBankState({
          ...state,
          request: {
            ...state.request,
            [key]: value,
          },
        })
      );
    },
    [dispatch, state]
  );

  const onAccountVerification = useCallback(
    (accountNumber: string) => {
      if (accountNumber?.length === 10 && /^\d+$/.test(accountNumber)) {
        onSetFieldRequest("accountNumber", accountNumber);
        onVerifyAccount({
          bankCode: state.request?.bankCode,
          accountNumber,
        });
      } else {
        onSetFieldRequest("accountName", "");
      }
    },
    [onSetFieldRequest, onVerifyAccount, state]
  );

  const proceedToOtpVerification = useCallback(
    (request: MakePayment) => {
      dispatch(
        setAllBankState({
          ...state,
          current: 1,
          request,
        })
      );
    },
    [dispatch, state]
  );

  return {
    onVerifyAccount,
    onProceedToPay,
    onAccountVerification,
    onSetFieldRequest,
    proceedToOtpVerification,
    dataSource,
    loading: bankForPaymentResult.isLoading,
    disabled,
    form,
    paymentInfo: app.paymentInfo,
    validating: validateBankAccountResult.isLoading,
    processing: proceedToPayResult.isLoading,
  };
};

export default useBank;
