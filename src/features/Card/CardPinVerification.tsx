import { Button, ConfigProvider, Form, Input } from "antd";
import { antdFormConfig } from "../../utils/helper";
import useCard from "../../hooks/useCard";
import useSubmittable from "../../hooks/useSubmittable";
import { useEffect, useRef } from "react";
import { OTPRef } from "antd/es/input/OTP";

const CardPinVerification: React.FC = () => {
  const {
    onCardPinVerification,
    onCardinalRedirection,
    state,
    mutateResult,
    loading,
    paymentInfo,
  } = useCard();
  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);
  const pinInputRef = useRef<OTPRef>(null);

  useEffect(() => {
    if (pinInputRef) {
      pinInputRef.current?.focus();
    }
  }, [pinInputRef]);

  if (state.showConsent) {
    return (
      <div className="h-full">
        <p className="text-center text-[14px] w-[80%] mx-auto mb-44 text-gray-text my-2">
          Please click the button below to authenticate with your bank
        </p>
        <Button
          type="primary"
          htmlType="submit"
          className="shadow-none disabled:border-none text-[12px flex mt-20 items-center justify-center p-6 font-inter-medium"
          onClick={onCardinalRedirection}
          loading={loading}
          block
          style={{
            backgroundColor: paymentInfo?.customization?.buttonColor,
          }}
        >
          {loading ? "Redirecting" : "Authenticate"}
        </Button>
        <button
          type="button"
          className="mx-auto block mt-3 text-gray-text font-inter-medium text-[12px]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <p className="text-center text-[12px] text-gray-text my-2">
        Please enter your 4-digit PIN to authorize this payment
      </p>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              fontSize: 60,
              colorText: "#CCCCCCCC",
            },
          },
        }}
      >
        <Form
          form={form}
          onFinish={(e) => onCardPinVerification(state, e, 2)}
          {...antdFormConfig}
          className="flex flex-col items-center justify-center h-full mt-6"
        >
          <Form.Item
            name="pin"
            className="flex-1 font-inter-medium"
            rules={[
              { required: true, message: "PIN is required" },
              {
                pattern: /^[0-9]{4}$/,
                message: "Invalid input",
              },
            ]}
          >
            <Input.OTP ref={pinInputRef} length={4} size="large" mask />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="shadow-none disabled:border-none text-[12px flex mt-20 items-center justify-center p-6 font-inter-medium"
            disabled={disabled}
            loading={mutateResult.isLoading}
            block
            style={{
              backgroundColor: disabled
                ? undefined
                : paymentInfo?.customization?.buttonColor,
            }}
          >
            Authorize
          </Button>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default CardPinVerification;
