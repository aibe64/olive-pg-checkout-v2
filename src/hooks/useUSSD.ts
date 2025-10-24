import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Form, FormInstance } from "antd";
import {
  UssdBanks,
  MakePaymentResponse,
  PaymentInfo,
} from "../models/client/response";
import {
  useGetDataQuery,
  useLazyGetDataQuery,
  useMutateDataMutation,
  useVerifyPaymentMutation,
} from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import useNotification from "./useNotification";
import useSubmittable from "./useSubmittable";
import {
  ApiResponseHandle,
  deviceInformation,
  updatePaymentActivity,
} from "../utils/helper";
import { setAllAppState, setAllUSSDState } from "../store";
import useTimer from "./useTimer";
import { Encryption } from "../utils/encryption";

interface USSDFunction {
  onProceedToPay: (request: { bankCode: string }) => void;
  loading: boolean;
  dataSource: Array<{
    label: string;
    value: string;
  }>;
  disabled: boolean;
  form: FormInstance;
  submitting: boolean;
  validatePaymentData: any;
  verifyPaymentResult: any;
  verifyPayment: any;
  timeRemaining: number;
  validatePayment: any;
  paymentInfo: PaymentInfo;
}

const useUSSD = (): USSDFunction => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => {
    return state.app;
  });
  const ussd = useAppSelector((state) => {
    return state.ussd;
  });
  const { data, isLoading, isFetching }: any = useGetDataQuery({
    getUrl: endpoints.getUssdBanks,
  });
  const [makePayment, makePaymentResult] = useMutateDataMutation();
  const [reValidatePayment] = useLazyGetDataQuery();

  const [form] = Form.useForm();
  const { onNotify } = useNotification();
  const { disabled } = useSubmittable(form);

  const onProceedToPay = useCallback(
    async (request: { bankCode: string }) => {
      const fieldRequest = JSON.parse(request.bankCode);
      const data = {
        bankCode: fieldRequest.bankCode,
        transactionId: app.paymentInfo?.transactionId,
        paymentType: "USSD",
        country: "Nigeria",
        currency: app.paymentInfo?.currency,
        amount: `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
        email: app.paymentInfo?.email,
        productId: app.paymentInfo?.productId,
        merchantId: app.paymentInfo?.merchantId,
        entryType: "Frontend",
        isRecurring: false,
        isStaticRoute: 0,
        ussdString: fieldRequest.ussdString,
        deviceInformation,
        metaData: app.paymentInfo?.metadata,
      };
      const apiRequest = Encryption.encryptWithRequestKey(JSON.stringify(data));
      try {
        updatePaymentActivity("Initiating USSD payment", "Click", app);
        const response = await makePayment({
          postUrl: endpoints.makePayment,
          request: { payload: apiRequest },
        });
        const apiResponse: MakePaymentResponse =
          response.error ?? response.data;
        if (apiResponse?.responseCode !== "09") {
          updatePaymentActivity(apiResponse?.responseMessage, "Error", app);
          ApiResponseHandle.errorResponse(
            app,
            apiResponse?.responseCode,
            apiResponse?.responseMessage,
            apiResponse
          );
        } else {
          updatePaymentActivity("USSD code generated", "Click", app);
          dispatch(
            setAllUSSDState({
              ...ussd,
              current: 1,
              responseMessage: apiResponse?.responseMessage,
              MakePaymentResponse: apiResponse.data,
            })
          );
        }
      } catch (error) {
        dispatch(
          setAllAppState({
            ...app,
            showErrorAlert: true,
            responseDescription: "Something went wrong.",
          })
        );
      }
    },
    [app, dispatch, makePayment, onNotify, ussd]
  );

  const dataSource: Array<{ label: string; value: string }> = Array.isArray(
    data?.data
  )
    ? data?.data?.map((item: UssdBanks) => ({
        ...item,
        label: item.bankName,
        value: JSON.stringify(item),
      }))
    : [];

  // useEffect(() => {
  //   if (isError) {
  //     onNotify("error", "Error occured", error?.data?.responseMessage);
  //   }
  // }, [error?.data?.responseMessage, isError, onNotify]);

  const [validatePayment, { data: validatePaymentData }] =
    useMutateDataMutation();
  const [verifyPayment, verifyPaymentResult] = useVerifyPaymentMutation();
  const { timeRemaining } = useTimer();

  useEffect(() => {
    if (timeRemaining <= 0) {
      updatePaymentActivity(
        "Customer time to complete payment expired",
        "Error",
        app
      );
      reValidatePayment({
        getUrl: endpoints.ReValidatePayment,
      });
      ApiResponseHandle.errorResponse(
        app,
        "USSD_ELAPSED",
        "The time to complete your payment has expired, and we haven’t received the funds. Please check with your bank to confirm if the payment was successful. If not, you can initiate a new payment to complete your transaction.",
        {
          transactionId: app.paymentInfo?.transactionId,
        }
      );
    }
  }, [timeRemaining, app]);

  return {
    onProceedToPay,
    loading: isFetching || isLoading,
    disabled,
    dataSource,
    form,
    submitting: makePaymentResult.isLoading,
    validatePaymentData,
    verifyPaymentResult,
    timeRemaining,
    verifyPayment,
    validatePayment,
    paymentInfo: app?.paymentInfo,
  };
};

export default useUSSD;
