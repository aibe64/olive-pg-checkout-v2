import { Button } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLazyGetDataQuery } from "../../store/api/api.config";
import { endpoints } from "../../store/endpoints";
import { useAppSelector } from "../../store/hooks";
interface ResponsePageProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
  buttonName: string;
}

const PGResponsePage: React.FC<ResponsePageProps> = ({
  buttonName,
  description,
  image,
  onClick,
  title,
}) => {
  const state = useAppSelector((state) => {
    return state.app;
  });
  const [closeTransaction] = useLazyGetDataQuery();
  const [redirectTimer, setRedirectTimer] = useState(7);

  const handleClick = () => {
    const challengeFrame = document.getElementById("challengeFrame");

    if (challengeFrame) {
      challengeFrame.style.display = "none";
    }
    if (onClick) onClick();
  };

  const decrementSeconds = useCallback(() => {
    let redirectTimer = 7;
    setInterval(function () {
      redirectTimer = redirectTimer - 1;
      if (
        redirectTimer >= 0 &&
        state.paymentInfo &&
        (state.paymentInfo?.callbackUrl?.length as number) > 0
      ) {
        setRedirectTimer(redirectTimer);
      } else {
        handleClick();
      }
    }, 1000);
  }, [state?.paymentInfo]);

  useEffect(() => {
    decrementSeconds();
  }, [decrementSeconds]);

  useEffect(() => {
    closeTransaction({
      getUrl: endpoints.CloseTransaction,
    });
  }, []);

  return (
    <div className="md:w-[30rem] flex flex-col items-center bg-white border border-gray-bg rounded-[8px] py-10 !z-50">
      <img src={image} alt="" />
      <div className="my-12 mt-8 w-[90%]">
        <h1 className="font-inter-semibold text-center text-lg md:text-xl">
          {title}
        </h1>
        <p className="font-inter-medium text-gray-text text-[14px] text-center mt-5 w-[80%] mx-auto">
          {description}
        </p>
      </div>
      {/* <Button
        type="primary"
        onClick={hancleClick}
        className="shadow-none mx-auto bg-[#F1F1F1] hover:!bg-[#F1F1F1] text-gray-text !z-50 hover:!text-gray-text border-none flex text-[12px] items-center justify-center p-5 px-10 font-inter-medium"
      >
        {buttonName}
      </Button> */}{" "}
      {state.paymentInfo &&
      (state.paymentInfo?.callbackUrl?.length as number) > 0 ? (
        <span>
          {`${
            window.self !== window.parent
              ? "Closing modal"
              : "Redirecting you back to merchant page"
          } in ` + (redirectTimer ? redirectTimer : 0)}
        </span>
      ) : state.paymentInfo &&
        (state.paymentInfo?.callbackUrl?.length as number) > 0 ? (
        <span>
          {`${
            window.self !== window.parent
              ? "Closing modal"
              : "Redirecting you back to merchant page"
          } in ` + (redirectTimer ? redirectTimer : 0)}
        </span>
      ) : (
        <Button
          type="primary"
          style={{
            background: state.paymentInfo?.customization?.buttonColor,
            color: "white",
          }}
          onClick={handleClick}
          className="shadow-none mx-auto bg-[#F1F1F1] hover:!bg-[#F1F1F1] text-gray-text !z-50 hover:!text-gray-text border-none flex text-[12px] items-center justify-center p-5 px-10 font-inter-medium"
        >
          {buttonName}
        </Button>
      )}
    </div>
  );
};

export const ResponsePage = React.memo(PGResponsePage);
