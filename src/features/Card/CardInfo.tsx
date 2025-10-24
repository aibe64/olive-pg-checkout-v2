import { Button, Checkbox, Form, Input } from "antd";
import { antdFormConfig, getTextColor, lightenColor } from "../../utils/helper";
import padlock from "../../assets/icons/padlock.svg";
import ICard from "../../assets/icons/ICard";
import { useAppSelector } from "../../store/hooks";
import useCard from "../../hooks/useCard";
import VerifyEmailToViewSavedCards from "./VerifyEmailToViewSavedCards";
import useAmountFormatter from "../../hooks/useAmountFormatter";
import useDisableEvent from "../../hooks/useDisableEvent";
import useSubmittable from "../../hooks/useSubmittable";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResponseCode } from "../../models/application/enum";

const CardInfo: React.FC = () => {
  const state = useAppSelector((state) => {
    return state.card;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);
  const [loadRememberCard, setLoadRememberCard] = useState(false);
  const {
    onCardInfoSubmit,
    onSaveCard,
    onUseSavedCardsVerification,
    onSetField,
    validateExpiryDate,
    handleExpiryDateChange,
    cardNumberValidator,
    onCardPinVerification,
    mutateResult,
    cardImg,
    paymentInfo,
  } = useCard();

  const { formattedAmount } = useAmountFormatter();
  const { cardNumberInputRef, cvvInputRef, expiryInputRef } = useDisableEvent();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const email = app.paymentInfo?.email;
  const atIndex = email.indexOf("@");
  const charactersBeforeAt = email.slice(0, atIndex);
  const maskedEmail =
    charactersBeforeAt.slice(0, 3) +
    "....." +
    charactersBeforeAt.slice(-3) +
    email.slice(atIndex);

  const secondaryColor = useMemo(() => {
    if (
      app?.paymentInfo?.customization?.buttonColor &&
      app?.paymentInfo?.customization?.buttonColor?.length
    ) {
      return lightenColor(app?.paymentInfo?.customization?.buttonColor, 70);
    } else {
      return undefined;
    }
  }, [app?.paymentInfo?.customization?.buttonColor]);

  useEffect(() => {
    if (
      state.request?.cvv &&
      state.request?.cvv?.length === 3 &&
      buttonRef.current
    ) {
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 0);
    }
  }, [state.request, buttonRef]);

  return (
    <>
      {state.useSavedCardVerification ? (
        <VerifyEmailToViewSavedCards />
      ) : (
        <div>
          <p
            className="text-center text-[12px] text-gray-text my-2 custom-text-color"
            style={
              {
                "--custom-text-color": getTextColor(
                  paymentInfo?.customization?.bodyColor ?? ""
                ),
              } as React.CSSProperties
            }
          >
            Enter your card details to pay
          </p>
          <Form
            {...antdFormConfig}
            form={form}
            onFinish={(values) =>
              app.paymentInfo?.currency?.toUpperCase() !== "NGN"
                ? onCardPinVerification(state, values, 2)
                : onCardInfoSubmit(state, app, 1, values)
            }
            fields={[
              {
                name: "cardNumber",
                value: state.request.cardNumber,
              },
              {
                name: "cvv",
                value: state.request.cvv,
              },
            ]}
            className="animate-fadeIn"
          >
            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[
                { required: true, message: "Card Number is required" },
                {
                  validator(_rule, value) {
                    return cardNumberValidator(_rule, value);
                  },
                },
              ]}
            >
              <Input
                prefix={
                  !state.cardType ? (
                    <ICard
                      color={
                        app?.paymentInfo?.customization?.buttonColor ??
                        "#006F01"
                      }
                      className="mr-1"
                    />
                  ) : (
                    <img
                      src={cardImg(state.cardType)}
                      className="w-7 h-7 object-contain mr-1"
                    />
                  )
                }
                ref={cardNumberInputRef}
                placeholder="0000 0000 0000 0000"
                onChange={(e) =>
                  onSetField(state, "cardNumber", e.target.value)
                }
                suffix={<img src={padlock} />}
              />
            </Form.Item>
            <div className="flex items-center gap-5 -mt-2">
              <Form.Item
                name="expiryDate"
                label="Valid Till"
                rules={[
                  { required: true, message: "Card validity is required" },
                  {
                    validator(_rule, value) {
                      if (value) {
                        const result = validateExpiryDate(value);
                        if (!result) {
                          return Promise.reject(
                            new Error("Invalid expiry date")
                          );
                        }
                        if (result === "The card has expired!") {
                          return Promise.reject(new Error(result));
                        }
                        const nextEle = document.getElementById(
                          "cvv"
                        ) as HTMLInputElement | null;
                        nextEle?.focus();
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  prefix={
                    <ICard
                      color={
                        app?.paymentInfo?.customization?.buttonColor ??
                        "#006F01"
                      }
                      className="mr-1"
                    />
                  }
                  onChange={(e) => handleExpiryDateChange(form, e)}
                  placeholder="MM/YY"
                  id="expiry"
                  ref={expiryInputRef}
                />
              </Form.Item>
              <Form.Item
                name="cvv"
                label="CVV"
                rules={[
                  { required: true, message: "CVV is required" },
                  {
                    validator(_rule, value) {
                      if (value) {
                        const nextEle = document.getElementById(
                          "cvv"
                        ) as HTMLInputElement | null;
                        nextEle?.focus();
                      }
                      if ((value?.length as number) < 3) {
                        return Promise.reject(
                          new Error("CVV must be three digit")
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input
                  prefix={
                    <ICard
                      color={
                        app?.paymentInfo?.customization?.buttonColor ??
                        "#006F01"
                      }
                      className="mr-1"
                    />
                  }
                  type="password"
                  placeholder="123"
                  id="cvv"
                  minLength={3}
                  onChange={(e) => {
                    onSetField(state, "cvv", e.target.value);
                  }}
                  maxLength={3}
                  ref={cvvInputRef}
                />
              </Form.Item>
            </div>
            <div
              onClick={() => {
                !state.shouldRemeberCard && onSaveCard(app, state);
                setLoadRememberCard(true);
              }}
              className="flex cursor-pointer items-center mb-5"
            >
              <Checkbox
                value={state.shouldRemeberCard}
                checked={state.shouldRemeberCard}
                className="mr-2"
              />
              <p className="text-gray-text font-inter-medium text-[11px]">
                Remember this card next time
              </p>
              {mutateResult.isLoading && loadRememberCard && (
                <LoadingOutlined
                  color="#006F01"
                  size={10}
                  className="ml-5"
                  spin
                />
              )}
            </div>
            {state.shouldRemeberCard && (
              <div
                className={`${
                  state.apiResponse.responseCode === ResponseCode.SUCCESS
                    ? "text-gray-text"
                    : "text-[#ff0000]"
                } font-inter-regular text-[12px] -mt-3 mb-5 flex items-center gap-2`}
              >
                <span>
                  {state.apiResponse.responseCode === ResponseCode.SUCCESS
                    ? "Your card has been saved to"
                    : state.apiResponse?.responseMessage}
                </span>
                {state.apiResponse.responseCode === ResponseCode.SUCCESS && (
                  <span className="border-b border-dashed border-gray-text ">
                    {maskedEmail}
                  </span>
                )}
              </div>
            )}
            <Button
              ref={buttonRef}
              tabIndex={0}
              type="primary"
              id="pay_with_card"
              htmlType="submit"
              className="shadow-none disabled:border-none flex text-[12px] items-center justify-center p-6 font-inter-medium"
              disabled={disabled}
              onClick={() => setLoadRememberCard(false)}
              loading={mutateResult.isLoading && !loadRememberCard}
              block
              style={{
                backgroundColor: disabled
                  ? undefined
                  : app?.paymentInfo?.customization?.buttonColor,
                outline: disabled
                  ? "none"
                  : secondaryColor
                  ? `4px solid ${secondaryColor}`
                  : "#4f9648",
              }}
            >
              Pay {app.paymentInfo?.currency?.toUpperCase() ?? "₦"}{" "}
              {formattedAmount(
                `${app.selectedPaymentMethod?.totalAmount ?? "0.00"}`
              )}
            </Button>
            <button
              type="button"
              className="mx-auto mt-3 text-gray-text font-inter-medium text-[12px] block"
              onClick={() => onUseSavedCardsVerification(true)}
            >
              Use a saved card
            </button>
          </Form>
        </div>
      )}
    </>
  );
};

export default CardInfo;
