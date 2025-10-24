import { useCallback, useEffect, useRef, useState } from "react";
import { ResponseCode } from "../models/application/enum";
import {
  BaseQueryErrorResponse,
  MakePaymentResponse,
  TransferVerificationResponse,
} from "../models/client/response";
import { setAppState } from "../store";
import {
  SOCKET_API,
  useLazyGetDataQuery,
  useMutateDataMutation,
} from "../store/api/api.config";
import { endpoints } from "../store/endpoints";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Encryption } from "../utils/encryption";
import {
  ApiResponseHandle,
  deviceInformation,
  generateBadRequestErrorMessage,
  updatePaymentActivity,
} from "../utils/helper";
import { XpressSocket } from "../utils/socket";

export const useNqr = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => {
    return state.card;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [mutate, result] = useMutateDataMutation();
  const [reValidatePayment] = useLazyGetDataQuery();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = new XpressSocket(SOCKET_API);

  const initiateNqr = useCallback(async () => {
    const request = {
      callbackUrl: state.request?.callbackUrl ? state.request.callbackUrl : "",
      country: "Nigeria",
      paymentType: "QR",
      cardBrand: "",
      publicKey: "",
      token: null,
      currency: "NGN",
      email: app.paymentInfo?.email,
      entryType: "Frontend",
      firstName: "",
      lastName: "",
      metaData: app.paymentInfo?.metadata ? app.paymentInfo.metadata : "",
      phoneNumber: app.request?.phoneNumber ? app.request.phoneNumber : "",
      productDescription: app.paymentInfo?.productDescription
        ? app.paymentInfo?.productDescription
        : "",
      productId: app.paymentInfo?.productId ? app.paymentInfo?.productId : "",
      transactionId: app.paymentInfo?.transactionId,
      amount: `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
      accountName: "",
      accountNumber: "",
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
      bvn: "",
      isRecurring: app.paymentInfo?.isRecurring,
      deviceInformation,
      merchantId: app.paymentInfo?.merchantId,
    };
    const payload = Encryption.encryptWithRequestKey(JSON.stringify(request));
    const response = await mutate({
      postUrl: endpoints.makePayment,
      request: { payload: payload },
    });
    const apiResponse: MakePaymentResponse = response.error ?? response.data;
    if (apiResponse?.responseCode === "12") {
      dispatch(
        setAppState({ key: "qrCode", value: apiResponse?.data?.authData })
      );
    } else if (response.error) {
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
          transactionId: app.paymentInfo?.transactionId,
        }
      );
    } else {
      ApiResponseHandle.errorResponse(
        app,
        apiResponse?.responseCode,
        apiResponse?.responseMessage ?? "",
        apiResponse
      );
    }
  }, [state?.request, app?.paymentInfo, app?.request, dispatch]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "nqr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    if (app.qrCode) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            updatePaymentActivity(
              "Customer payment session elapsed for QR code",
              "Error",
              app
            );
            reValidatePayment({
              getUrl: endpoints.ReValidatePayment,
            });
            ApiResponseHandle.errorResponse(
              app,
              "TIME_ELAPSED",
              "This payment session has expired. Please generate a new QR code.",
              {
                transactionId: app.paymentInfo?.transactionId,
              }
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [app]);

  useEffect(() => {
    if (app.qrCode) {
      socket.receiveNotification((message) => {
        try {
          const response = JSON.parse(message) as TransferVerificationResponse;
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            updatePaymentActivity(response?.ResponseMessage, "Success", app);
            ApiResponseHandle.successResponse(app, {
              transactionId: app.paymentInfo?.transactionId,
              responseCode: response.ResponseCode,
              responseMessage: response.ResponseMessage,
            });
            dispatch(
              setAppState({
                key: "showResponsePage",
                value: true,
              })
            );
          } else {
            updatePaymentActivity(
              response?.ResponseMessage ??
                "Unable to process transaction at this time, try again later.",
              "Error",
              app
            );
            {
              ApiResponseHandle.errorResponse(
                app,
                response.ResponseCode,
                response?.ResponseMessage ??
                  "Unable to process transaction at this time, try again later.",
                {
                  transactionId: app.paymentInfo?.transactionId,
                }
              );
            }
          }
        } catch (error) {}
      });

      socket.startConnection();

      return () => {
        socket.stopConnection();
      };
    }
  }, [app, dispatch]);

  return {
    initiateNqr,
    isGenerating: result?.isLoading,
    timeLeft,
    handleDownload,
    canvasRef,
  };
};
