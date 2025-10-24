import { Spin } from "antd";
import { useRef, useState, useEffect } from "react";
import { PageLoader } from "../../common/components/PageLoader";
import { ResponseCode } from "../../models/application/enum";
import { TransferVerificationResponse } from "../../models/client/response";
import { setAllAppState, setCardState } from "../../store";
import { SOCKET_API } from "../../store/api/api.config";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ApiResponseHandle, updatePaymentActivity } from "../../utils/helper";
import { OliveSocket } from "../../utils/socket";
import successIcon from "../../assets/images/success-check.png";

export const MasterCardInternationalPaymentFrame = () => {
  const dispatch = useAppDispatch();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const state = useAppSelector((state) => {
    return state.card;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });

  const socket = new OliveSocket(SOCKET_API);

  useEffect(() => {
    const form = document.getElementById(
      "threedsChallengeRedirectForm"
    ) as HTMLFormElement;
    if (form) {
      form.submit();
    }
  }, [iframeRef]);

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin !== window.location.origin) {
        setIsHidden(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    socket.receiveNotification((message) => {
      try {
        const response = JSON.parse(message) as TransferVerificationResponse;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          updatePaymentActivity("response.ResponseMessage", "Success", app);
          ApiResponseHandle.successResponse(app, {
            transactionId: app.paymentInfo?.transactionId,
            responseCode: response.ResponseCode,
            responseMessage: response.ResponseMessage,
          });
          dispatch(
            setAllAppState({
              ...app,
              showResponsePage: true,
              hideCard: false,
              responseTitle: "Payment made successfully",
              responseDescription: response.ResponseMessage,
              responseBtnName: "Close Window",
              responseImage: successIcon,
              responseOnClick: () =>
                (window.location.href = app.paymentInfo?.callbackUrl),
            })
          );
          dispatch(
            setCardState({ key: "showMasterCardInternational", value: false })
          );
        } else {
          {
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
                "Unable to process transaction at this time, try again later."
            );
          }
        }
      } catch (error) {}
    });

    const interval = setInterval(() => {
      socket.startConnection();
    }, 2000);

    return () => {
      socket.stopConnection();
      clearInterval(interval);
    };
  }, [app, dispatch, isHidden]);
  return (
    <>
      <div className="flex justify-center">
        <Spin
          spinning={isHidden}
          indicator={<PageLoader tip="Verifying payment..." />}
          tip="Verifying payment..."
        />
      </div>
      <div
        style={isHidden ? { visibility: "hidden" } : {}}
        dangerouslySetInnerHTML={{ __html: state.MakePaymentResponse.authData }}
      />
    </>
  );
};
