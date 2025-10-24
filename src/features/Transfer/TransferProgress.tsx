import { Progress } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { formatTime } from "../../utils/helper";
import Spinner from "../../assets/icons/Spinner";
import useTransferProgress from "../../hooks/useTransferProgress";

const TransferProgress: React.FC = () => {
  const { percent, timeRemaining, showGetAccountForTransferComponent } =
    useTransferProgress();

  return (
    <div>
      <p className="text-center text-[12px] md:w-[75%] mx-auto mt-5 font-light">
        We’re checking your transaction status. This can take a few minutes.
      </p>
      <div className="flex items-center gap-2 mt-10 mb-5">
        <div className="grid place-content-center">
          <CheckCircleOutlined className="mx-auto text-[#ffffff] bg-[#006f01] rounded-full text-2xl" />
          <p className="font-medium text-[12px] mt-1 text-[#006f01]">Sent</p>
        </div>
        <Progress
          showInfo={false}
          size="small"
          strokeColor="#006f01"
          percent={percent}
        />
        <div className="grid place-content-center">
          <Spinner />
          <p className="font-medium text-[12px] mt-1 text-gray-text">
            Received
          </p>
        </div>
      </div>
      <p className="text-center mt-5 text-gray-text">
        Wait Time:{" "}
        <span className="text-orange-text">
          {formatTime(timeRemaining)} minutes
        </span>
      </p>
      <p
        onClick={showGetAccountForTransferComponent}
        className="text-center mt-5 text-gray-text underline cursor-pointer"
      >
        Show Payment Account
      </p>
    </div>
  );
};

export default TransferProgress;
