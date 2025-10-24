import { useAppSelector } from "../../store/hooks";
import TransferProgress from "../Transfer/TransferProgress";
import CardInfo from "./CardInfo";
import CardPinVerification from "./CardPinVerification";
import OtpVerification from "./OtpVerification";

const Card: React.FC = () => {
  // const app = useAppSelector(state => {
  //   return state.app
  // })
  const state = useAppSelector((state) => {
    return state.card;
  });

  const steps = [
    {
      key: 1,
      content: <CardInfo />,
    },
    {
      key: 2,
      content: <CardPinVerification />,
    },
    {
      key: 3,
      content: <OtpVerification />,
    },
    {
      key: 4,
      content: <TransferProgress />,
    },
  ];
  // .filter((step) => {
  //   if (app.paymentInfo?.currency?.toUpperCase() !== "NGN") {
  //     return step.key !== 2
  //   }
  //   return step.key
  // })

  return steps[state.current].content;
};

export default Card;
