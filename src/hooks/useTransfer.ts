import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Form, FormInstance } from "antd";
import {
  UssdBanks,
  MakePaymentResponseData,
  PaymentInfo,
} from "../models/client/response";
import {
  useGetDataQuery,
  useMutateDataMutation,
} from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import useSubmittable from "./useSubmittable";
import { deviceInformation, updatePaymentActivity } from "../utils/helper";
import useTimer from "./useTimer";
import { setAllTransferState } from "../store/slice/transfer.slice";
import { Encryption } from "../utils/encryption";
import { ResponseCode } from "../models/application/enum";
import { setAppState } from "../store";
import { useResponse } from "./useResponse";

interface TransferFunction {
  onProceedToPay: (request: {
    bankCode: string;
    firstName: string;
    lastName: string;
  }) => void;
  loading: boolean;
  dataSource: Array<{
    label: string;
    value: string;
  }>;
  disabled: boolean;
  form: FormInstance;
  submitting: boolean;
  timeRemaining: number;
  paymentInfo: PaymentInfo;
}

const useTransfer = (): TransferFunction => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => {
    return state.app;
  });
  const transfer = useAppSelector((state) => {
    return state.transfer;
  });
  const { data, error, isError, isLoading, isFetching }: any = useGetDataQuery({
    getUrl: endpoints.getBanksForVirtualAccount,
  });
  const [makePayment, makePaymentResult] = useMutateDataMutation();

  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);
  const { handleResponse } = useResponse();

  const onProceedToPay = useCallback(
    async (request: {
      bankCode: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        const data = {
          bankCode: JSON.parse(request.bankCode).bankCode,
          transactionId: app.paymentInfo?.transactionId,
          paymentType: "Transfer",
          firstName: "Olive",
          lastName: "Payments",
          country: "Nigeria",
          currency: app.paymentInfo?.currency,
          amount: `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
          email: app.paymentInfo?.email,
          productId: app.paymentInfo?.productId,
          merchantId: app.paymentInfo?.merchantId,
          entryType: "Frontend",
          isRecurring: false,
          isStaticRoute: 0,
          deviceInformation,
          metaData: app.paymentInfo?.metadata,
        };
        const apiRequest = {
          payload: Encryption.encryptWithRequestKey(JSON.stringify(data)),
        };
        updatePaymentActivity("Initiated Pay with Transfer", "Click", app);
        const response = await makePayment({
          postUrl: endpoints.makePayment,
          request: apiRequest,
        });
        handleResponse<MakePaymentResponseData>(
          response,
          true,
          (responseData) => {
            updatePaymentActivity(
              "Virtual account details generated",
              "Response",
              app
            );
            dispatch(
              setAllTransferState({
                ...transfer,
                current: 1,
                MakePaymentResponse: responseData as MakePaymentResponseData,
                request,
              })
            );
          },
          ResponseCode.UPDATED_VIRTUAL
        );
      } catch {
        dispatch(setAppState({ key: "showErrorAlert", value: true }));
        dispatch(
          setAppState({
            key: "responseDescription",
            value:
              "Error occurred while creating your virtual account. Please try again",
          })
        );
      }
    },
    [app, dispatch, makePayment, transfer]
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

  useEffect(() => {
    if (isError) {
      dispatch(setAppState({ key: "showErrorAlert", value: true }));
      dispatch(
        setAppState({
          key: "responseDescription",
          value: error?.data?.responseMessage,
        })
      );
    }
  }, [error?.data?.responseMessage, isError, dispatch]);

  const { timeRemaining } = useTimer();

  return {
    onProceedToPay,
    loading: isFetching || isLoading,
    disabled,
    dataSource,
    form,
    submitting: makePaymentResult.isLoading,
    timeRemaining,
    paymentInfo: app?.paymentInfo,
  };
};

export default useTransfer;
