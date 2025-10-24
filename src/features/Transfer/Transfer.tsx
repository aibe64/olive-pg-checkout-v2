import { useAppSelector } from "../../store/hooks";
import SelectBank from "./SelectBank";
import GetAccountForTransfer from "./GetAccountForTransfer";
import TransferProgress from "./TransferProgress";

const Transfer: React.FC = () => {
  const transfer = useAppSelector(state => {
    return state.transfer
  })
  const steps = [
    {
      content: <SelectBank />
    },
    {
      content: <GetAccountForTransfer />
    },
    {
      content: <TransferProgress />
    }
  ]

  return steps[transfer.current]?.content
};

export default Transfer;
