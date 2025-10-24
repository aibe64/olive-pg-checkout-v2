import { Form, Input, Button, InputRef } from "antd";
import { antdFormConfig, formatSecondsToMinutes } from "../../utils/helper";
import useCard from "../../hooks/useCard";
import useTimer from "../../hooks/useTimer";
import useSubmittable from "../../hooks/useSubmittable";
import { useEffect, useRef } from "react";

const OtpVerification: React.FC = () => {
  const loading = false;
  const { onOtpVerification, mutateResult, paymentInfo } = useCard();
  const { timeRemaining } = useTimer(1800);
  const [form] = Form.useForm();
  const { disabled } = useSubmittable(form);
  const otpInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (otpInputRef) {
      otpInputRef.current?.focus();
    }
  }, [otpInputRef]);
  return (
    <div className="h-full">
      <p className="font-inter-medium text-[14px] text-center">
        Verification Code
      </p>
      <p className="text-center text-[14px] text-gray-text my-3">
        Please enter the OTP sent to your email <br /> and mobile number to
        verify this payment
      </p>
      <Form
        form={form}
        {...antdFormConfig}
        onFinish={onOtpVerification}
        className="flex flex-col h-full"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "OTP is required" },
            {
              pattern: /^\d+$/,
              message: "Invalid OTP entered",
            },
          ]}
          className="flex-1 mx-5"
        >
          <Input className="w-full py-2 text-center" ref={otpInputRef} />
        </Form.Item>
        <div className="flex items-center justify-center mb-14 font-inter-regular">
          <span className="text-center">
            You have{" "}
            <span className="font-inter-semibold">
              {formatSecondsToMinutes(timeRemaining)}
            </span>{" "}
            to enter the OTP. If not completed within this time, the card
            transaction will be automatically cancelled.
          </span>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className="shadow-none border-none flex text-[12px] items-center justify-center p-6 font-inter-medium"
          loading={mutateResult?.isLoading && !loading}
          disabled={disabled}
          block
          style={{
            backgroundColor: disabled
              ? undefined
              : paymentInfo?.customization?.buttonColor,
          }}
        >
          Verify
        </Button>
      </Form>
    </div>
  );
};

export default OtpVerification;
