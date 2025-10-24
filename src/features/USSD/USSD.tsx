import { useAppSelector } from "../../store/hooks";
import GetUSSDCode from "./GetUSSDCode";
import SelectBank from "./SelectBank";

const Ussd: React.FC = () => {
  const state = useAppSelector((state) => {
    return state.ussd;
  });
  const steps = [
    {
      key: 1,
      content: <SelectBank />,
    },
    {
      key: 2,
      content: <GetUSSDCode />,
    },
  ];
  return steps[state.current].content;
};

export default Ussd;
