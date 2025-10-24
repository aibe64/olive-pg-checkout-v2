import { useCallback, useEffect, useState } from "react";
import { ResponseCode } from "../models/application/enum";
import { TransferVerificationResponse } from "../models/client/response";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAllTransferState } from "../store/slice/transfer.slice";
import { XpressSocket } from "../utils/socket";
import { ApiResponseHandle, updatePaymentActivity } from "../utils/helper";
import useAmountFormatter from "./useAmountFormatter";
import useTimer from "./useTimer";
import { setAppState } from "../store";
import { SOCKET_API, useLazyGetDataQuery } from "../store/api/api.config";
import { endpoints } from "../store/endpoints";

const useAccountForTransfer = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => {
    return state.app;
  });
  const transfer = useAppSelector((state) => {
    return state.transfer;
  });
  const { formattedAmount } = useAmountFormatter();
  const { timeRemaining } = useTimer(1800);
  const [copyText, setCopyText] = useState<{
    amountCopied: boolean;
    accountNumberCopied: boolean;
  }>({ amountCopied: false, accountNumberCopied: false });
  const [reValidatePayment] = useLazyGetDataQuery();

  const autoShowCopy = useCallback(() => {
    if (copyText.amountCopied) {
      setTimeout(() => {
        setCopyText((prev) => ({
          ...prev,
          amountCopied: false,
        }));
      }, 3000);
    } else if (copyText.accountNumberCopied) {
      setTimeout(() => {
        setCopyText((prev) => ({
          ...prev,
          accountNumberCopied: false,
        }));
      }, 3000);
    }
  }, [copyText]);

  const socket = new XpressSocket(SOCKET_API);

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
    autoShowCopy();
  }, [autoShowCopy]);

  const onPaymentConfirmation = () => {
    dispatch(
      setAllTransferState({
        ...transfer,
        current: 2,
      })
    );
  };

  const fallbackCopyTextToClipboard = (
    text: string,
    copyType: "account_number" | "amount"
  ) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";  
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    if (copyType === "account_number") {
      setCopyText((prev) => ({
        ...prev,
        accountNumberCopied: !prev.accountNumberCopied,
      }));
    } else if (copyType === "amount") {
      setCopyText((prev) => ({
        ...prev,
        amountCopied: !prev.amountCopied,
      }));
    }

    try {
      document.execCommand("copy");
    } catch (err) {
      alert("Unable to copy");
    }

    document.body.removeChild(textArea);
  };
 
  useEffect(() => {
    if (timeRemaining <= 0) {
      updatePaymentActivity("Customer transfer time elapsed", "Error", app);
      reValidatePayment({
        getUrl: endpoints.ReValidatePayment,
      });
      ApiResponseHandle.errorResponse(
        app,
        "TIME_ELAPSED",
        "It looks like the time to complete your transfer has elapsed, and we haven’t received the funds. Please start a new transfer",
        {
          transactionId: app.paymentInfo?.transactionId,
        }
      );
    }
  }, [timeRemaining, app]);

  return {
    formattedAmount,
    timeRemaining,
    fallbackCopyTextToClipboard,
    onPaymentConfirmation,
    app,
    transfer,
    copyText,
    setCopyText,
  };
};

export default useAccountForTransfer;
