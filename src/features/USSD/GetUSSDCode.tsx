import { useAppDispatch, useAppSelector } from "../../store/hooks";
import copy from "../../assets/icons/copy.svg";
import useUSSD from "../../hooks/useUSSD";
import { useEffect, useState } from "react";
// import { endpoints } from "../../store/endpoints";
import { ApiResponseHandle, formatTime, updatePaymentActivity } from "../../utils/helper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";
import { ResponseCode } from "../../models/application/enum";
import { XpressSocket } from "../../utils/socket";
import { SOCKET_API } from "../../store/api/api.config";
import { TransferVerificationResponse } from "../../models/client/response";
import { setAppState } from "../../store";

const GetUSSDCode: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => {
    return state.ussd;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [open, setOpen] = useState(false);
  const {
    timeRemaining,
    // verifyPayment,
    // validatePaymentData,
    // validatePayment,
    // verifyPaymentResult,
  } = useUSSD();

  const socket = new XpressSocket(SOCKET_API);

  useEffect(() => {
    socket.receiveNotification((message) => {
      try {
        const response = JSON.parse(message) as TransferVerificationResponse;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          updatePaymentActivity(
            response?.ResponseMessage,
            "Success",
            app
          );
          ApiResponseHandle.successResponse(app, {
            transactionId: app.paymentInfo?.transactionId,
            responseCode: response.ResponseCode,
            responseMessage: response.ResponseMessage
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
      } catch (error) {}
    });

    socket.startConnection();

    return () => {
      socket.stopConnection();
    };
  }, [app, dispatch]);

 

  return (
    <div>
      <p className="text-center text-[12px] text-gray-text my-2 mx-auto w-[95%]">
        Dial the <b>{state.request?.bank}</b> USSD code below on your mobile
        phone to complete the payment.
      </p>
      <div className="flex items-center justify-center mt-10">
        <strong className="text-2xl">
          {state?.responseMessage}
        </strong>
      </div>
      <CopyToClipboard
        onCopy={() => setOpen(true)}
        text={state?.responseMessage}
      >
        <button
          type="button"
          className="flex items-center justify-center hover:scale-95 transition-all text-gray-text mx-auto gap-2 font-inter-regular text-[12px] mt-1"
        >
          {open ? (
            <div className="relative">
              <CheckOutlined className="text-[#006f01]" />
              <CheckOutlined className="text-[#006f01] absolute left-[0.1rem] top-[0.3rem]" />
            </div>
          ) : (
            <img src={copy} alt="" />
          )}
          Copy USSD Code
        </button>
      </CopyToClipboard>
      <div className="flex flex-col justify-center items-center mt-5">
        <div className="loader" />
        <p className="text-gray-text text-center text-[12px] mt-3">
          Please stay on this page while we get transaction status in{" "}
          <span className="text-orange-text">{formatTime(timeRemaining)}</span>
        </p>
      </div>
    </div>
  );
};

export default GetUSSDCode;
