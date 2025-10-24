import { Button, Form, Select } from "antd";
import { antdFormConfig, getTextColor } from "../../utils/helper";
import dropdown from "../../assets/icons/dropdown.svg";
import { ClipLoader } from "react-spinners";
import useTransfer from "../../hooks/useTransfer";

const SelectBank: React.FC = () => {
  const {
    form,
    loading,
    disabled,
    dataSource,
    submitting,
    onProceedToPay,
    paymentInfo,
  } = useTransfer();

  return (
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
        Please provide the following information to proceed
      </p>
      <Form
        form={form}
        onFinish={onProceedToPay}
        {...antdFormConfig}
        className="mt-5 animate-fadeIn"
      >
        <Form.Item
          className="mb-[120px]"
          name="bankCode"
          label="Select Bank"
          rules={[{ required: true, message: "Bank is required" }]}
        >
          <Select
            placeholder="Select Bank"
            loading={loading}
            allowClear
            showSearch
            suffixIcon={
              loading ? (
                <ClipLoader color="#006F01" size={15} />
              ) : (
                <img src={dropdown} />
              )
            }
            options={dataSource}
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        {/* <Form.Item
          label="First Name"
          name="firstName"
          className="-mt-3"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input className="py-1" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          className="-mt-3"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input className="py-1" />
        </Form.Item> */}
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={disabled}
          loading={submitting}
          style={{
            backgroundColor: disabled
              ? undefined
              : paymentInfo?.customization?.buttonColor,
          }}
          className="shadow-none text-[12px] border-none flex items-center justify-center p-6 font-inter-medium"
        >
          Proceed to Pay
        </Button>
      </Form>
    </div>
  );
};

export default SelectBank;
