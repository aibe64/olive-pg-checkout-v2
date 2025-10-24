import { useCallback, useEffect, useState } from "react";
import { ResponseCode } from "../models/application/enum";
import { TransferVerificationResponse } from "../models/client/response";
import { setAppState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAllTransferState } from "../store/slice/transfer.slice";
import { ApiResponseHandle, updatePaymentActivity } from "../utils/helper";
import { SOCKET_API, useLazyGetDataQuery } from "../store/api/api.config";
import { XpressSocket } from "../utils/socket";
import { endpoints } from "../store/endpoints";

const useTransferProgress = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => {
    return state.app;
  });
  const transfer = useAppSelector((state) => {
    return state.transfer;
  });
  const socket = new XpressSocket(SOCKET_API);

  const totalTime = 1800;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [reValidatePayment] = useLazyGetDataQuery();

  const showGetAccountForTransferComponent = useCallback(() => {
    dispatch(
      setAllTransferState({
        ...transfer,
        current: 1,
      })
    );
  }, []);

  useEffect(() => {
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
  }, [app, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      updatePaymentActivity("Customer transfer time elapsed", "Error", app);
      reValidatePayment({
        getUrl: endpoints.ReValidatePayment,
      });
      ApiResponseHandle.errorResponse(
        app,
        "TIME_ELAPSED",
        "The time to complete your transfer has passed, and we haven’t received the funds. Please check with the merchant to confirm if the transfer was completed. If it wasn’t, you can start a new transfer to ensure your transaction is processed",
        {
          transactionId: app.paymentInfo?.transactionId,
        }
      );
    }
  }, [timeRemaining, app]);

  const percent = ((totalTime - timeRemaining) / totalTime) * 100;

  return {
    percent,
    timeRemaining,
    showGetAccountForTransferComponent,
  };
};

export default useTransferProgress;
