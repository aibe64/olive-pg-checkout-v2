import { Button, Form, Input, Select } from "antd";
import { antdFormConfig } from "../../utils/helper";
import dropdown from "../../assets/icons/dropdown.svg";
import { useAppSelector } from "../../store/hooks";
import useBank from "../../hooks/useBank";
import { ClipLoader } from "react-spinners";
import { LoadingOutlined } from "@ant-design/icons"
import { ResponseCode } from "../../models/application/enum";

const SelectBank: React.FC = () => {
  const state = useAppSelector((state) => {
    return state.bank;
  });
  const {
    onAccountVerification,
    proceedToOtpVerification,
    onSetFieldRequest,
    loading,
    dataSource,
    disabled,
    form,
    validating,
    paymentInfo
  } = useBank();

  return (
    <div>
      <p className="text-center text-[12px] text-gray-text my-2">
        Please choose your bank to process payment
      </p>
      <Form
        form={form}
        {...antdFormConfig}
        onFinish={proceedToOtpVerification}
        className="mt-5"
        fields={[
          {
            name: "accountName",
            value: state.request?.accountName,
          },
        ]}
      >
        <Form.Item
          name="bankCode"
          label="Select Bank"
          rules={[{ required: true, message: "Bank is required" }]}
        >
          <Select
            placeholder="Select bank"
            loading={loading}
            allowClear
            showSearch
            onChange={(e) => onSetFieldRequest("bankCode", e)}
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
        <Form.Item
          name="accountNumber"
          label="Account Number"
          rules={[
            { required: true, message: "Account number is required" },
            {
              pattern: /^\d+$/,
              message: "Invalid input entered",
            },
          ]}
          help={
            state.apiResponse?.responseCode !== ResponseCode.SUCCESS &&
            state.apiResponse?.responseMessage
          }
          validateStatus={
            validating
              ? "validating"
              : state.apiResponse?.responseCode
              ? state.apiResponse?.responseCode === ResponseCode.SUCCESS
                ? "success"
                : "error"
              : undefined
          }
        >
          <Input
            placeholder="0000000000"
            onChange={(e) => onAccountVerification(e.target.value)}
            minLength={10}
            maxLength={10}
            readOnly={!state.request?.bankCode}
            suffix={validating ? <LoadingOutlined /> : <span />}
          />
        </Form.Item>
        {state.request?.accountName && (
          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[{ required: true, message: "Account name is required" }]}
          >
            <Input disabled className="border-none py-1" />
          </Form.Item>
        )}
        <Button
          type="primary"
          htmlType="submit"
          block
          className="shadow-none border-none text-[12px] flex items-center justify-center p-6 font-inter-medium"
          disabled={disabled || !state.request?.accountName}
          style={{
            backgroundColor: disabled
              ? undefined
              : paymentInfo?.customization?.buttonColor,
          }}
        >
          Proceed to Pay
        </Button>
      </Form>
    </div>
  );
};

export default SelectBank;
