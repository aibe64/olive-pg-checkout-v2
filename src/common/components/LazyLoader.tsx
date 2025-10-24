/* eslint-disable react-hooks/exhaustive-deps */
import { Progress } from "antd";
import { useMemo, useState } from "react";
import logo from "../../assets/images/logoheader.svg";
export const LazyLoader = () => {
  const [percent, setPercent] = useState(0);

  const setState = () => {
    for (var i = 1; i <= 100; i++) {
      var tick = function (percent: number) {
        return function () {
          setPercent(percent);
        };
      };
      setTimeout(tick(i), 100 * i);
    }
  };

  useMemo(() => {
    setState();
  }, []);
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-[100vw] min-h-[80vh]">
      <div className="flex gap-2 items-center">
        <img src={logo} className="w-[40px]" alt="" />
        <span className="font-semibold text-[30px] text-[#0a6a15]">
          Xpress<span className="text-[#e66c17]">Pay</span>
        </span>
      </div>
      <Progress
        strokeColor={"green"}
        percent={percent}
        status="active"
        showInfo={false}
        className="w-[180px]"
      />
    </div>
  );
};
