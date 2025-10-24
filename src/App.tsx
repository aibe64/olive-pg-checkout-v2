import { ConfigProvider, App as AntdApp, Spin } from "antd";
import { getThemeConfig } from "./utils/theme.config";
import useApp from "./hooks/useApp";
import { Suspense, useMemo } from "react";
import { LazyLoader } from "./common/components/LazyLoader";
import { MobileView } from "./common/components/MobileView";
import { DesktopView } from "./common/components/DesktopView";
import { PageLoader } from "./common/components/PageLoader";
import { MasterCardInternationalPaymentFrame } from "./features/Card/MasterCardInternationalPaymentFrame";
import { lightenColor } from "./utils/helper";

const App = () => {
  const { paymentInfoResult, paymentVerificationResult, state } = useApp(true);

  if (state.hideCard) {
    return <MasterCardInternationalPaymentFrame />;
  }

  const secondaryColor = useMemo(() => {
    if (
      state?.paymentInfo?.customization?.buttonColor &&
      state?.paymentInfo?.customization?.buttonColor?.length
    ) {
      return lightenColor(state?.paymentInfo?.customization?.buttonColor, 70);
    } else {
      return undefined;
    }
  }, [state?.paymentInfo?.customization?.buttonColor]);

  return (
    <Suspense fallback={<LazyLoader />}>
      <ConfigProvider
        theme={getThemeConfig(
          state?.paymentInfo?.customization?.buttonColor?.length
            ? state?.paymentInfo?.customization?.buttonColor?.length
            : undefined,
          secondaryColor
        )}
      >
        <AntdApp className="relative overflow-hidden bg-[#E8E8E8] md:bg-transparent z-30">
          <Spin
            indicator={<PageLoader />}
            spinning={
              paymentInfoResult.isLoading ||
              paymentInfoResult.isFetching ||
              paymentVerificationResult.isLoading ||
              paymentVerificationResult.isFetching
            }
          >
            <div className="min-h-[100svh] flex justify-center pt-20 px-5">
              <DesktopView />
              <MobileView />
            </div>
          </Spin>
        </AntdApp>
      </ConfigProvider>
    </Suspense>
  );
};

export default App;
