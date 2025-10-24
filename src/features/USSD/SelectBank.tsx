import { Button, Form, Select } from "antd";
import { antdFormConfig } from "../../utils/helper";
import dropdown from "../../assets/icons/dropdown.svg";
import useUSSD from "../../hooks/useUSSD";
import { ClipLoader } from "react-spinners";

const SelectBank: React.FC = () => {
  const {
    form,
    loading,
    disabled,
    dataSource,
    submitting,
    onProceedToPay,
    paymentInfo,
  } = useUSSD();

  return (
    <div>
      <p className="text-center text-[12px] text-gray-text my-2">
        Please choose your bank to process payment
      </p>
      <Form
        form={form}
        onFinish={onProceedToPay}
        {...antdFormConfig}
        className="mt-5 animate-fadeIn"
      >
        <Form.Item
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
          className="shadow-none mt-32 border-none text-[12px] flex items-center justify-center p-6 font-inter-medium"
        >
          Proceed to Pay
        </Button>
      </Form>
    </div>
  );
};

export default SelectBank;
