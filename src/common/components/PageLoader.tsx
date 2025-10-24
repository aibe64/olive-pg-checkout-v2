import { Typography } from "antd";
import { FC } from "react";
import { useAppSelector } from "../../store/hooks";

export const PageLoader: FC<{ tip?: string }> = ({ tip }) => {
  const app = useAppSelector((state) => {
    return state.app;
  });
  return (
    <div className="grid place-content-center gap-3 min-h-[70svh] px-5">
      <span
        style={{
          borderTop: `4px solid ${
            app.paymentInfo?.customization?.buttonColor ?? "#E8E8E8"
          }`,
        }}
        className="loader mx-auto"
      ></span>
      <Typography
        style={{
          color: app.paymentInfo?.customization?.buttonColor ?? "green",
        }}
        className="font-semibold"
      >
        {tip ?? "Loading..."}
      </Typography>
    </div>
  );
};
