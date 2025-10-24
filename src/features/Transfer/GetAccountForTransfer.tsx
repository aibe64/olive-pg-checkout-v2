import { Button } from "antd";
import copy from "../../assets/icons/copy.svg";
import { formatTime } from "../../utils/helper";
import useAccountForTransfer from "../../hooks/useAccountForTransfer";

const GetAccountForTransfer: React.FC = () => {
  const {
    formattedAmount,
    timeRemaining,
    app,
    transfer,
    fallbackCopyTextToClipboard,
    onPaymentConfirmation,
    copyText,
  } = useAccountForTransfer();
  return (
    <div>
      <p className="text-center text-[12px] font-inter-medium my-2">
        Transfer N
        {formattedAmount(`${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`)}{" "}
        to {app.paymentInfo?.businessName}
      </p>
      <div className="bg-gray-bg rounded-[16px] p-5 mt-3">
        <div className="mb-3">
          <p className="text-gray-text text-[10px] font-inter-regular">
            Bank Name
          </p>
          <h2 className="text-[13px]">
            {JSON.parse(transfer.request?.bankCode).bankName}
          </h2>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-gray-text text-[10px] font-inter-regular">
              Account Number
            </p>
            <h2 className="text-[13px]">
              {transfer.MakePaymentResponse?.accountNumber}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              fallbackCopyTextToClipboard(
                transfer.MakePaymentResponse?.accountNumber,
                "account_number"
              )
            }
          >
            {copyText.accountNumberCopied ? (
              <span>Copied!</span>
            ) : (
              <img src={copy} alt="" />
            )}
          </button>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-gray-text text-[10px] font-inter-regular">
              Account Name
            </p>
            <h2 className="text-[13px]">
              {transfer.MakePaymentResponse?.accountName}
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-text text-[10px] font-inter-regular">
              Amount
            </p>
            <h2 className="text-[13px]">
              N{" "}
              {formattedAmount(
                `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              fallbackCopyTextToClipboard(
                `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`,
                "amount"
              )
            }
          >
            {copyText.amountCopied ? (
              <span>Copied!</span>
            ) : (
              <img src={copy} alt="" />
            )}
          </button>
        </div>
      </div>
      <p className="text-center text-gray-text font-inter-medium mt-5 text-[11px]">
        Use this account for this transaction only.
      </p>
      <div className="flex flex-col justify-center items-center mt-5">
        <div className="loader" />
        <p className="text-gray-text text-[12px] mt-3">
          Expires in{" "}
          <span className="text-orange-text">{formatTime(timeRemaining)}</span>
        </p>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        block
        onClick={onPaymentConfirmation}
        style={{
          backgroundColor: app?.paymentInfo?.customization?.buttonColor,
        }}
        className="shadow-none mt-5  text-[12px] border-none flex items-center justify-center p-6 font-inter-medium"
      >
        I have made the payment
      </Button>
    </div>
  );
};

export default GetAccountForTransfer;
