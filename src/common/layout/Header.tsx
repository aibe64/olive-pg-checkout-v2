import { Alert, Tooltip, Typography } from "antd";
import { useCallback } from "react";
import avatar from "../../assets/images/avatar.png";
import useAmountFormatter from "../../hooks/useAmountFormatter";
import { State } from "../../models/application/state";
import { setAppState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getTextColor, maskEmail } from "../../utils/helper";

const Header: React.FC = () => {
  const state: State = useAppSelector((state) => {
    return state.app;
  });
  const paymentMethod = state.selectedPaymentMethod;
  const dispatch = useAppDispatch();
  const { formattedAmount } = useAmountFormatter();

  const onCloseErrorAlert = useCallback(() => {
    dispatch(setAppState({ key: "showErrorAlert", value: false }));
  }, []);

  return (
    <header className="flex flex-col border-b border-gray-bg">
      <div className="px-3  h-[4.5rem] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="bg-[#006F011A] h-10 w-10 rounded-full"
            style={{
              background: state.paymentInfo?.customization?.logoUrl
                ? "white"
                : "#006F011A",
            }}
          >
            <img
              src={state.paymentInfo?.customization?.logoUrl ?? avatar}
              alt="avatar"
              className="rounded-full"
              style={{
                width: state.paymentInfo?.customization?.logoUrl
                  ? "2.45rem"
                  : undefined,
                height: state.paymentInfo?.customization?.logoUrl
                  ? "2.45rem"
                  : undefined,
                objectFit: state.paymentInfo?.customization?.logoUrl
                  ? "contain"
                  : undefined,
              }}
            />
          </div>
          <Tooltip title={state?.paymentInfo?.businessName}>
            <Typography
              className="text-gray-text font-inter-regular text-[12px] overflow-hidden text-ellipsis whitespace-nowrap flex-1 max-w-[150px] custom-text-color"
              style={
                {
                  "--custom-text-color": getTextColor(
                    state.paymentInfo?.customization?.bodyColor ?? ""
                  ),
                } as React.CSSProperties
              }
            >
              {state?.paymentInfo?.businessName}
            </Typography>
          </Tooltip>
        </div>
        <div className="grid justify-items-end">
          <div className="flex flex-col">
            <div className="text-2xl font-inter-medium flex items-center justify-end">
              <sup className="text-[12px] font-inter-bold mr-1 mt-1">
                {state.paymentInfo.currency}
              </sup>
              <h1
                className="font-inter-bold"
                style={{
                  fontSize: `${
                    `${paymentMethod?.totalAmount ?? "0.00"}`.length > 10
                      ? "1rem"
                      : `${paymentMethod?.totalAmount ?? "0.00"}`.length > 6
                      ? "1.1rem"
                      : "1.3rem"
                  }`,
                }}
              >
                {formattedAmount(paymentMethod?.totalAmount ?? 0)}
              </h1>
            </div>
            <div className="font-inter-regular flex items-center justify-end -mt-2">
              <span className="!text-[0.7rem] text-[#000000B2]">Charges:</span>
              <span className="font-inter-bold text-[#000000B2] !text-[0.7rem]">
                {state.paymentInfo.currency}
                {formattedAmount(paymentMethod?.chargeAmount ?? 0)}
              </span>
            </div>
          </div>

          <p
            className="text-orange-text text-[12px] font-inter-regular custom-text-color"
            style={
              {
                "--custom-text-color": getTextColor(
                  state.paymentInfo?.customization?.bodyColor ?? ""
                ),
              } as React.CSSProperties
            }
          >
            {maskEmail(state.paymentInfo?.email ?? "")}
          </p>
        </div>
      </div>
      {state.showErrorAlert && (
        <div className="mb-1">
          <Alert
            message={state?.responseDescription}
            type="error"
            showIcon
            closable
            onClose={onCloseErrorAlert}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
