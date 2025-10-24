import { Button } from "antd";
import payxpressIcon from "../../assets/images/payxpress_large.png";
import { useWallet } from "../../hooks/useWallet";

export const ConfirmPayment = () => {
  const { onMakePayment, processing, onCancel, buttonColor } = useWallet();
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <img src={payxpressIcon} alt="" className="w-[9rem]" />
      <span className="text-center">Do you to want proceed with payment?</span>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onMakePayment}
          style={{
            backgroundColor: buttonColor,
            color: "white",
          }}
          type="primary"
          loading={processing}
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
