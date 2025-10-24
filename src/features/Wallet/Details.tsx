import { Button } from "antd";
import { WalletIcon } from "../../assets/icons/Wallet";
import useAmountFormatter from "../../hooks/useAmountFormatter";
import { useWallet } from "../../hooks/useWallet";
export const WalletDetails = () => {
  const { details, isInsufficient, onConfirmPayment, onCancel, buttonColor } =
    useWallet();
  const { formattedAmount } = useAmountFormatter();
  return (
    <div className="flex flex-col justify-between !h-[350px]">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <span className="text-[#656565]">Tag Name</span>
          <span className="text-end">{details?.tagName ?? "N/A"}</span>
        </div>
        <div className="bg-[#F1F1F1] px-3 py-5 rounded-md flex gap-1 items-center">
          <div className="bg-[#006F0126] h-8 w-8 flex justify-center items-center rounded-full">
            <WalletIcon color={"#006F01"} />
          </div>
          <div className="flex gap-1 items-center">
            {" "}
            <span className="text-[#656565] text-[1.1rem]">
              Wallet Balance:
            </span>
            <span className="text-[1.2rem]">
              ₦{formattedAmount(details?.balance ?? "0.00")}
            </span>
          </div>
        </div>
        {isInsufficient ? (
          <span className="text-danger text-[0.8rem] text-center">
            Insufficient Wallet Balance. Fund your wallet to proceed.
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onConfirmPayment}
          type="primary"
          style={{
            backgroundColor: buttonColor,
            color: "white",
          }}
          className="shadow-none text-[12px] border-none flex items-center justify-center p-6 font-inter-medium w-full mt-4"
        >
          Confirm Payment
        </Button>
        <Button
          onClick={onCancel}
          className="shadow-none text-[12px] text-primary-green flex items-center hover:!bg-white justify-center p-6 font-inter-medium w-full !border-primary-green !border-[1px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
