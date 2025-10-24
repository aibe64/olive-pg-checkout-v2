import { Button, Checkbox } from "antd";
import { useState } from "react";
import { maskCardNumber } from "../../utils/helper";
import useCard from "../../hooks/useCard";
import { SavedCards as CardSaved } from "../../models/client/response";
import { FaRegTrashAlt } from "react-icons/fa";
import { useAppSelector } from "../../store/hooks";
import { LoadingOutlined } from "@ant-design/icons";

const SavedCards: React.FC = () => {
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [selectCardIndex, setSelectCardIndex] = useState<number>();
  const [selectCardToDel, setSelectCardToDel] = useState<number | null>();
  const [cardSelected, setCardSelected] = useState<CardSaved>();
  const {
    onUseSavedCardsVerification,
    onRemoveCard,
    onCardInfoSubmit,
    onCardPinVerification,
    cardImg,
    state,
    mutateResult,
    paymentInfo
  } = useCard();

  const handleDelete = (pan: string, index: number) => {
    setSelectCardToDel(index);
    onRemoveCard({
      email: app.paymentInfo?.email,
      pan,
    });
  };

  const handleCardSelection = (index: number, item: CardSaved) => {
    setSelectCardIndex(index);
    setCardSelected(item);
  };

  const formatPan = (value: string) => {
    return value?.replace(/\B(?=(\d{4})+(?!\d))/g, " ");
  };
  return (
    <>
      <h3 className="text-center text-[12px] text-gray-text font-inter-medium m-3 w-[80%] mx-auto">
        Your Saved Cards
      </h3>
      <div className="overflow-auto h-[13rem] mb-5">
        {Array.isArray(state.savedCards) && state.savedCards?.length ? (
          state.savedCards?.map((item: CardSaved, index) => (
            <div key={index} className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleCardSelection(index + 1, item)}
                className="border rounded-[8px] flex w-full hover:!border-[#006F01] transition-all items-center justify-between p-4"
                style={{
                  borderColor:
                    selectCardIndex === index + 1 ? "#006F01" : "#E8E8E8",
                  backgroundColor:
                    selectCardIndex === index + 1 ? "#E5F1E6" : "#FFFFFF",
                }}
              >
                <img src={cardImg(item.CardBrand)} className="w-[24px]" />
                <section className="text-[12px]">
                  {maskCardNumber(formatPan(item.CardPan))}
                </section>
                <section className="text-[12px]">
                  {item.ExpiryMonth}/{item.ExpiryYear}
                </section>
                <section className="text-[12px]">
                  **{item.Cvv?.charAt(2)}
                </section>
                <section>
                  <Checkbox checked={selectCardIndex === index + 1} />
                </section>
              </button>
              {selectCardToDel === index && mutateResult?.isLoading ? (
                <LoadingOutlined color="#006f01" spin />
              ) : (
                <FaRegTrashAlt
                  className="text-[#ff0000] hover:scale-95 cursor-pointer"
                  onClick={() => handleDelete(item?.CardPan, index)}
                />
              )}
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <Button
        type="primary"
        htmlType="submit"
        disabled={!selectCardIndex}
        loading={selectCardIndex && mutateResult.isLoading}
        className="shadow-none border-none flex items-center justify-center text-[12px] p-6 font-inter-medium"
        onClick={() =>
          app.paymentInfo?.currency?.toUpperCase() !== "NGN"
            ? onCardPinVerification(
                state,
                {
                  cardNumber: cardSelected?.CardPan,
                  expiryDate: `${cardSelected?.ExpiryMonth}/${cardSelected?.ExpiryYear}`,
                  cvv: cardSelected?.Cvv,
                },
                2
              )
            : onCardInfoSubmit(state, app, 1, {
                cardNumber: cardSelected?.CardPan,
                expiryDate: `${cardSelected?.ExpiryMonth}/${cardSelected?.ExpiryYear}`,
                cvv: cardSelected?.Cvv,
              })
        }
        block
        style={{
          backgroundColor: !selectCardIndex
            ? undefined
            : paymentInfo?.customization?.buttonColor,
        }}
      >
        Use Selected Card
      </Button>
      <button
        type="button"
        className="mx-auto block mt-3 text-gray-text font-inter-medium text-[12px]"
        onClick={() => onUseSavedCardsVerification(false)}
      >
        Pay With Another Card
      </button>
    </>
  );
};

export default SavedCards;
