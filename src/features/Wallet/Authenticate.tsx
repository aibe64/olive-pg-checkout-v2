import { Button, Form, Input, Alert } from "antd";
import payxpressIcon from "../../assets/images/payxpress_large.png";
import { useWallet } from "../../hooks/useWallet";

export const WalletAuthentication = () => {
  const {
    form,
    disabled,
    onSetField,
    onAuthenticate,
    processing,
    isLoginError,
    errorMessage,
    buttonColor,
  } = useWallet();
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <img src={payxpressIcon} alt="PayXpress Logo" className="w-[9rem]" />
      {isLoginError && (
        <Alert message={errorMessage} type="error" showIcon closable />
      )}
      <span className="text-center text-sm text-gray-600">
        Log in to your PayXpress account to continue with your wallet payment.
        Enter your account details below and click <b>Authenticate</b> to
        proceed.
      </span>
      <Form
        onFinish={onAuthenticate}
        form={form}
        layout="vertical"
        className="w-full mt-1"
      >
        <Form.Item
          label="Tag Name / Email"
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input
            placeholder="Enter your username"
            onChange={(e) => onSetField("userName", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            onChange={(e) => onSetField("password", e.target.value)}
          />
        </Form.Item>

        <Form.Item className="mb-2">
          <Button
            type="primary"
            disabled={disabled}
            loading={processing}
            htmlType="submit"
            style={{
              background: disabled ? undefined : buttonColor,
              color: "white",
            }}
            className="shadow-none text-[12px] border-none flex items-center justify-center p-6 font-inter-medium w-full"
          >
            Authenticate
          </Button>
        </Form.Item>

        <div className="text-center text-[12px] text-gray-500">
          Don't have a PayXpress account?{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={import.meta.env.VITE_APP_WALLET_LOGIN}
            className="text-primary"
          >
            Register here
          </a>
        </div>
      </Form>
    </div>
  );
};
