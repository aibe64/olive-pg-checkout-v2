import { Button, ConfigProvider, Form, Input } from "antd";
import { OTPRef } from "antd/es/input/OTP";
import { useRef } from "react";
import { useWallet } from "../../hooks/useWallet";

export const WalletPin = () => {
  const pinInputRef = useRef<OTPRef>(null);
  const { onVerifyPayment, onSetPin, onCancel, buttonColor } = useWallet();
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
          onFinish={onVerifyPayment}
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
            <Input.OTP
              ref={pinInputRef}
              length={4}
              size="large"
              mask
              onChange={(e) => onSetPin(e)}
            />
          </Form.Item>
          <div className="flex flex-col gap-2">
            <Button
              style={{
                backgroundColor:buttonColor,
                color: "white",
              }}
              type="primary"
              htmlType="submit"
              className="shadow-none disabled:border-none text-[12px flex mt-20 items-center justify-center p-6 font-inter-medium"
              block
            >
              Verify & Pay
            </Button>
            <Button
              onClick={onCancel}
              className="shadow-none text-[12px] text-primary-green flex items-center hover:!bg-white justify-center p-6 font-inter-medium w-full !border-primary-green !border-[1px]"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};
