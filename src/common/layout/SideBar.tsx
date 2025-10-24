import { ConfigProvider, Menu, Typography } from "antd";
import useMenuKeys from "../../hooks/useMenuKeys";
import useMenuItems from "../../hooks/useMenuItems";
import useWindowInnerWidth from "../../hooks/useWindowWidth";
import useApp from "../../hooks/useApp";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setAllAppState, setAppState } from "../../store";
import cbn from "../../assets/images/cbn.png";
import { getTextColor, isValidURL, lightenColor } from "../../utils/helper";
import favicon from "../../../avatar.png";

const SideBar: React.FC = () => {
  const { onMenuKeyChange, state } = useMenuKeys();
  const dispatch = useAppDispatch();
  const items = useMenuItems();
  const innerWidth = useWindowInnerWidth();
  const { setshowPage } = useApp(false);

  const secondaryColor = useMemo(() => {
    if ( state?.paymentInfo?.customization?.buttonColor &&
      state?.paymentInfo?.customization?.buttonColor?.length) {
      return lightenColor(state?.paymentInfo?.customization?.buttonColor, 70);
    } else {
      return undefined;
    }
  }, [state?.paymentInfo?.customization?.buttonColor]);

  const handleSelectMenu = useCallback(
    (key: string) => {
      onMenuKeyChange(key);
      setshowPage(true);
      if (
        state.paymentInfo?.paymentMethod &&
        Array.isArray(state.paymentInfo?.paymentMethod)
      ) {
        const itemName = items.find((item) => item?.key === key)?.name;
        const paymentMethod = state.paymentInfo?.paymentMethod.find(
          (item) => item.paymentType?.toLowerCase() === itemName
        );
        dispatch(
          setAppState({ key: "selectedPaymentMethod", value: paymentMethod })
        );
      }
    },
    [state.paymentInfo?.paymentMethod]
  );

  useEffect(() => {
    if (
      items &&
      Array.isArray(items) &&
      items.length > 0 &&
      state.paymentInfo?.paymentMethod &&
      Array.isArray(state.paymentInfo?.paymentMethod)
    ) {
      const key = `${items[0].key}`;
      const itemName = items.find((item) => item?.key === key)?.name;
      const paymentMethod = state.paymentInfo?.paymentMethod.find(
        (item) => item.paymentType?.toLowerCase() === itemName
      );
      dispatch(
        setAllAppState({
          ...state,
          menuKey: key,
          selectedPaymentMethod: paymentMethod ?? {},
        })
      );
    }
  }, [items, state.paymentInfo?.paymentMethod]);

  // const setSingleMenuKey = useCallback(() => {
  //   if (state.paymentInfo) {
  //     const paymentInfo = state.paymentInfo;
  //     let key = "1";
  //     let menuCount = 0;
  //     if (paymentInfo.cardPayment) {
  //       menuCount = menuCount + 1;
  //       key = "2";
  //     }
  //     if (paymentInfo.bankTransferPayment) {
  //       menuCount = menuCount + 1;
  //       key = "1";
  //     }
  //     if (paymentInfo.qrPayment) {
  //       menuCount = menuCount + 1;
  //       key = "5";
  //     }
  //     if (paymentInfo.accountPayment) {
  //       menuCount = menuCount + 1;
  //       key = "4";
  //     }
  //     if (paymentInfo.ussdPayment) {
  //       menuCount = menuCount + 1;
  //       key = "3";
  //     }
  //     if (menuCount === 1) {
  //       dispatch(setAppState({ key: "menuKey", value: key }));
  //     }
  //   }
  // }, [state?.paymentInfo]);

  // useEffect(() => {
  //   setSingleMenuKey();
  // }, [setSingleMenuKey]);

  return (
    <nav className="md:border-r border-gray-bg py-4 md:pl-3 md:pb-20 relative">
      <p
        className="md:hidden font-inter-bold text-[10px] tracking-widest text-gray-text custom-text-color"
        style={
          {
            "--custom-text-color": getTextColor(
              state.paymentInfo?.customization?.bodyColor ?? ""
            ),
          } as React.CSSProperties
        }
      >
        SELECT ANY PAYMENT OPTIONS
      </p>
      <p
        className="max-md:hidden font-inter-semibold text-[10px] tracking-widest text-gray-text custom-text-color"
        style={
          {
            "--custom-text-color": getTextColor(
              state.paymentInfo?.customization?.bodyColor ?? ""
            ),
          } as React.CSSProperties
        }
      >
        PAYMENT OPTIONS
      </p>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              lineWidth: innerWidth > 768 ? 0 : 1,
              itemSelectedColor: state.paymentInfo?.customization?.buttonColor,
              itemSelectedBg: secondaryColor ?? "#F3FAF4",
              itemHoverBg: secondaryColor,
            },
          },
        }}
      >
        <Menu
          rootClassName="custom-menu"
          style={{
            ["--active-border-color" as any]:
              state.paymentInfo?.customization?.buttonColor ?? "#006f01",
          }}
          className="mt-5 text-[10px] !bg-transparent border border-gray-bg md:border-none !rounded-[8px]"
          defaultSelectedKeys={[innerWidth < 768 ? "0" : state?.menuKey ?? "1"]}
          selectedKeys={[innerWidth < 768 ? "0" : state.menuKey ?? "1"]}
          mode="inline"
          items={items}
          onClick={(e) => handleSelectMenu(e.key)}
        />
      </ConfigProvider>
      <div className="mt-2 flex flex-col gap-1 -mb-[70px]">
        <div className="flex items-center">
          <img src={cbn} alt="" className="h-3 w-3 mx-1" />
          <Typography className="!font-inter-medium text-gray-text !text-[10px]">
            <span>Licensed by the Central Bank of Nigeria</span>
          </Typography>
        </div>
        <div className="flex gap-1 items-center">
          <img
            src={
              state.paymentInfo?.customization?.footerLogo
                ? state.paymentInfo?.customization?.footerLogo
                : favicon
            }
            alt=""
            className="h-4 w-4 mr-1"
          />
          <a
            href={
              isValidURL(state.paymentInfo?.customization?.footerLink)
                ? state.paymentInfo?.customization?.footerLink
                : "https://xpresspayments.com/"
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              window.self !== window.parent
                ? "text-gray-text md:text-white"
                : "text-gray-text break-words whitespace-normal w-[80%]"
            } tracking-wide text-[11px] leading-4`}
          >
            {state.paymentInfo?.customization?.footerText ??
              "Xpress Payment Solutions Limited"}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default SideBar;
