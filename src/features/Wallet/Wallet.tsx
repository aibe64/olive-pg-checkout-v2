import { Spin } from "antd";
import { useAppSelector } from "../../store/hooks";
import { WalletAuthentication } from "./Authenticate";
import { ConfirmPayment } from "./ConfirmPayment";
import { WalletDetails } from "./Details";
import { WalletPin } from "./Pin";

export const PayxpressWallet = () => {
  const state = useAppSelector((state) => {
    return state.wallet;
  });
  switch (state.pageType) {
    case "authenticate":
      return <WalletAuthentication />;
    case "wallet_details":
      return <WalletDetails />;
    case "pin":
      return <WalletPin />;
    case "confirm_payment":
      return <ConfirmPayment />;
    default:
      return <Spin />;
  }
};
