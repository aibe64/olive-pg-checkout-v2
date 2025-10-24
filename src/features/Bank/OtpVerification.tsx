import { Form, Input, Button } from "antd";
import { antdFormConfig } from "../../utils/helper";
import useBank from "../../hooks/useBank";
import useSubmittable from "../../hooks/useSubmittable";

const OtpVerification: React.FC = () => {
  const [form] = Form.useForm();
  const { onProceedToPay, processing, paymentInfo } = useBank();
  const { disabled } = useSubmittable(form);
  return (
    <div className="h-full">
      <p className="font-inter-medium text-[14px] text-center">
        Verification Code
      </p>
      <p className="text-center text-[13px] text-gray-text my-5">
        Kindly dial *822*999*0# on your registered phone number to generate OTP,
        if already Registered, otherwise Dial *822# to Register for OTP
      </p>
      <Form
        form={form}
        {...antdFormConfig}
        onFinish={onProceedToPay}
        className="flex flex-col h-full my-5"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "OTP is required" },
            // {
            //   max: 6,
            //   min: 6,
            //   message: "OTP must be six characters",
            // },
            {
              pattern: /^\d+$/,
              message: "Invalid OTP entered",
            },
          ]}
          className="flex-1 mx-5"
        >
          <Input className="w-full py-2 text-center" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={disabled}
          loading={processing}
          className="shadow-none border-none flex text-[12px] items-center justify-center p-6 font-inter-medium"
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
    </div>
  );
};

export default OtpVerification;
