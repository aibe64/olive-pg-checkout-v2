import { Button, Form, Input } from "antd";
import { antdFormConfig } from "../../utils/helper";
import SavedCards from "./SavedCards";
import useCard from "../../hooks/useCard";
import { useAppSelector } from "../../store/hooks";
import useSubmittable from "../../hooks/useSubmittable";

const VerifyEmailToViewSavedCards: React.FC = () => {
  const {
    onUseSavedCardsVerification,
    onShowSavedCard,
    savedCards,
    paymentInfo,
  } = useCard();
  const state = useAppSelector((state) => {
    return state.card;
  });
  const app = useAppSelector((state) => {
    return state.app;
  });
  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);

  if (state.showSavedCards) {
    return <SavedCards />;
  }

  return (
    <div className="h-full">
      <h3 className="text-center text-[12px] text-gray-text font-inter-medium m-3 w-[80%] mx-auto">
        Enter your email address to access your saved cards
      </h3>
      <Form
        form={form}
        {...antdFormConfig}
        onFinish={onShowSavedCard}
        className="flex flex-col h-full"
        fields={[
          {
            name: "email",
            value: app.paymentInfo?.email,
          },
        ]}
      >
        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Email address is reqiured" },
            { type: "email", message: "Invalid email address" },
          ]}
          className="flex-1"
        >
          <Input placeholder="example@gmail.com" disabled className="py-1" />
        </Form.Item>
        {/* <p className="text-gray-text font-inter-regular text-[12px] -mt-1">
          An OTP will be sent to the registered phone number.
        </p> */}
        <Button
          type="primary"
          htmlType="submit"
          className="shadow-none border-none flex items-center text-[12px] justify-center p-6 font-inter-medium mt-16"
          block
          disabled={disabled}
          loading={savedCards.isLoading || savedCards.isFetching}
          style={{
            backgroundColor: disabled
              ? undefined
              : paymentInfo?.customization?.buttonColor,
          }}
        >
          Access saved cards
        </Button>
      </Form>
      <button
        type="button"
        className="mx-auto block mt-3 text-gray-text font-inter-medium text-[12px]"
        onClick={() => onUseSavedCardsVerification(false)}
      >
        Pay with another card
      </button>
    </div>
  );
};

export default VerifyEmailToViewSavedCards;
