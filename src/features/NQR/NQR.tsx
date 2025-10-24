import { QRCodeCanvas } from "qrcode.react";
import { Button } from "antd";
import { useNqr } from "../../hooks/useNqr";
import { useAppSelector } from "../../store/hooks";
import { formatTime } from "../../utils/helper";
import abbeyBank from "../../assets/icons/abbeyBank.svg";
import accessBank from "../../assets/icons/accessBank.png";
import fcmb from "../../assets/icons/fcmb.png";
import firstBank from "../../assets/icons/firstBank.png";
import providus from "../../assets/icons/providusBank.png";
import wemaBank from "../../assets/icons/wemaBank.svg";

const Nqr: React.FC = () => {
  const app = useAppSelector((state) => {
    return state.app;
  });
  const { initiateNqr, isGenerating, timeLeft, handleDownload, canvasRef } =
    useNqr();

  if (app.qrCode) {
    return (
      <div>
        <p className="text-center text-[12px] font-inter-regular my-2">
          Scan the QR code below in your mobile bank app to complete this
          payment.
        </p>
        <div className="flex flex-col items-center justify-center mt-5">
          <QRCodeCanvas
            value={app.qrCode}
            includeMargin={true}
            ref={canvasRef}
          />
          <p className="text-center text-[12px] font-inter-regular my-2">
            You have{" "}
            <span className="text-green-800 font-inter-bold">
              {formatTime(timeLeft)}
            </span>{" "}
            to complete the payment.
          </p>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            backgroundColor: app.paymentInfo?.customization?.buttonColor,
            color: "white",
          }}
          className="shadow-none mt-7 flex text-[12px] items-center justify-center p-6 font-inter-medium"
          block
          onClick={handleDownload}
        >
          Download QR Code
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-start w-full py-2 px-4">
        <span className="text-lg">Supported Banks</span>
      </div>
      <div className="flex justify-between items-center gap-2 w-full px-4">
        <img className="w-[18px] h-[24px]" src={accessBank} alt="" />
        <img className="w-[18px] h-[24px]" src={wemaBank} alt="" />
        <img className="w-[18px] h-[24px]" src={providus} alt="" />
        <img className="w-[18px] h-[24px]" src={abbeyBank} alt="" />
        <img className="w-[18px] h-[24px]" src={firstBank} alt="" />
        <img className="w-[18px] h-[24px]" src={fcmb} alt="" />
      </div>
      <p className="text-center text-[12px] font-inter-regular my-2 mt-[20px]">
        Tap "Generate QR Code" to initiate payment via NQR. Once the code
        appears, open your banking app, scan the QR, and complete the payment
        securely.
      </p>
      <Button
        type="primary"
        style={{
          backgroundColor: app.paymentInfo?.customization?.buttonColor,
          color: "white",
        }}
        htmlType="submit"
        className="shadow-none mt-7 flex text-[12px] items-center justify-center p-6 font-inter-medium !w-[60%]"
        block
        loading={isGenerating}
        onClick={initiateNqr}
      >
        Generate QR Code
      </Button>
    </div>
  );
};

export default Nqr;
