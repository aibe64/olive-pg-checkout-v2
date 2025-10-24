import { useAppSelector } from "../../store/hooks";
import OtpVerification from "./OtpVerification";
import SelectBank from "./SelectBank";

const Banks: React.FC = () => {
  const state = useAppSelector((state) => {
    return state.bank;
  });
  const steps = [
    {
      key: 1,
      content: <SelectBank />,
    },
    {
      key: 2,
      content: <OtpVerification />,
    },
  ];
  return steps[state.current].content;
};

export default Banks;
