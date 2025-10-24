import IBank from "../assets/icons/IBank";
import ICard from "../assets/icons/ICard";
import INqr from "../assets/icons/INqr";
import ITransfer from "../assets/icons/ITransfer";
import IUssd from "../assets/icons/IUssd";
import Payxpress from "../assets/images/payxpress.png";
import Banks from "../features/Bank/Banks";
import Card from "../features/Card/Card";
import Nqr from "../features/NQR/NQR";
import Transfer from "../features/Transfer/Transfer";
import Ussd from "../features/USSD/USSD";
import { useAppSelector } from "../store/hooks";
import check from "../assets/icons/tick-circle.svg";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { PayxpressWallet } from "../features/Wallet/Wallet";
import { useMemo } from "react";

type CustomMenuItem = ItemType<MenuItemType> & {
  content?: React.ReactNode;
  name?: string
};

const useMenuItems = (): CustomMenuItem[] => {
  const state = useAppSelector((state) => {
    return state.app;
  });

  const items = useMemo((): CustomMenuItem[] => {
    if (
      state.paymentInfo?.paymentMethod &&
      Array.isArray(state.paymentInfo?.paymentMethod) &&
      state.paymentInfo?.paymentMethod.length
    ) {
      let newItems: CustomMenuItem[] = [];
      state.paymentInfo?.paymentMethod.forEach((item) => {
        switch (item.paymentType?.toLowerCase()) {
          case "wallet":
            newItems = [
              ...newItems,
              {
                key: "1",
                name: "wallet",
                label: (
                  <div className="flex gap-2 items-center">
                    <img src={Payxpress} alt="" />
                    <div className="flex justify-between items-center">
                      Xpress Wallet{" "}
                      {state.menuKey === "6" && (
                        <img src={check} alt="" className="hidden" />
                      )}
                    </div>
                  </div>
                ),
                content: <PayxpressWallet />,
              },
            ];
            break;
          case "transfer":
            newItems = [
              ...newItems,
              {
                key: "2",
                name: "transfer",
                label: (
                  <div className="flex justify-between items-center">
                    Bank Transfer{" "}
                    {state.menuKey === "1" && (
                      <img src={check} alt="" className="hidden" />
                    )}
                  </div>
                ),
                icon: (
                  <ITransfer
                    color={
                      state.menuKey === "1"
                        ? state?.paymentInfo?.customization?.buttonColor ??
                          "#006F01"
                        : "#656565"
                    }
                    className={`h-8 w-8 p-2 rounded-full ${
                      state.menuKey === "1" ? "bg-white" : "bg-[#F1F1F1]"
                    }`}
                  />
                ),
                content: <Transfer />,
              },
            ];
            break;
          case "qr":
            newItems = [
              ...newItems,
              {
                key: "3",
                name: "qr",
                label: (
                  <div className="flex justify-between items-center">
                    NQR{" "}
                    {state.menuKey === "5" && (
                      <img src={check} alt="" className="hidden" />
                    )}
                  </div>
                ),
                icon: (
                  <INqr
                    color={
                      state.menuKey === "5"
                        ? state?.paymentInfo?.customization?.buttonColor ??
                          "#006F01"
                        : "#656565"
                    }
                    className={`h-8 w-8 p-2 rounded-full ${
                      state.menuKey === "5" ? "bg-white" : "bg-[#F1F1F1]"
                    }`}
                  />
                ),
                content: <Nqr />,
              },
            ];
            break;
          case "ussd":
            newItems = [
              ...newItems,
              {
                key: "4",
                name: "ussd",
                label: (
                  <div className="flex justify-between items-center">
                    USSD{" "}
                    {state.menuKey === "3" && (
                      <img src={check} alt="" className="hidden" />
                    )}
                  </div>
                ),
                icon: (
                  <IUssd
                    color={
                      state.menuKey === "3"
                        ? state?.paymentInfo?.customization?.buttonColor ??
                          "#006F01"
                        : "#656565"
                    }
                    className={`h-8 w-8 p-2 rounded-full ${
                      state.menuKey === "3" ? "bg-white" : "bg-[#F1F1F1]"
                    }`}
                  />
                ),
                content: <Ussd />,
              },
            ];
            break;
          case "card":
            newItems = [
              ...newItems,
              {
                key: "5",
                name: "card",
                label: (
                  <div className="flex justify-between items-center">
                    Card{" "}
                    {state.menuKey === "2" && (
                      <img src={check} alt="" className="hidden" />
                    )}
                  </div>
                ),
                icon: (
                  <ICard
                    color={
                      state.menuKey === "2"
                        ? state?.paymentInfo?.customization?.buttonColor ??
                          "#006F01"
                        : "#656565"
                    }
                    className={`h-8 w-8 p-2 rounded-full ${
                      state.menuKey === "2" ? "bg-white" : "bg-[#F1F1F1]"
                    }`}
                  />
                ),
                content: <Card />,
              },
            ];
            break;
          case "bank":
            newItems = [
              ...newItems,
              {
                key: "6",
                name: "bank",
                label: (
                  <div className="flex justify-between items-center">
                    Bank{" "}
                    {state.menuKey === "4" && (
                      <img src={check} alt="" className="hidden" />
                    )}
                  </div>
                ),
                icon: (
                  <IBank
                    color={
                      state.menuKey === "4"
                        ? state?.paymentInfo?.customization?.buttonColor ??
                          "#006F01"
                        : "#656565"
                    }
                    className={`h-8 w-8 p-2 rounded-full ${
                      state.menuKey === "4" ? "bg-white" : "bg-[#F1F1F1]"
                    }`}
                  />
                ),
                content: <Banks />,
              },
            ];
            break;

          default:
            break;
        }
      });
     return newItems.sort((a, b) => Number(a.key) - Number(b.key))
    } else {
      return [];
    }
  }, [
    state.paymentInfo?.paymentMethod,
    state?.paymentInfo?.customization?.buttonColor,
  ]);

  // const itemss: ItemType<MenuItemType>[] = [
  //   {
  //     key: "6",
  //     label: (
  //       <div className="flex gap-2 items-center">
  //         <img src={Payxpress} alt="" />
  //         <div className="flex justify-between items-center">
  //           Xpress Wallet{" "}
  //           {state.menuKey === "6" && (
  //             <img src={check} alt="" className="hidden" />
  //           )}
  //         </div>
  //       </div>
  //     ),
  //     content: <PayxpressWallet />,
  //   },
  //   {
  //     key: "1",
  //     label: (
  //       <div className="flex justify-between items-center">
  //         Bank Transfer{" "}
  //         {state.menuKey === "1" && (
  //           <img src={check} alt="" className="hidden" />
  //         )}
  //       </div>
  //     ),
  //     icon: (
  //       <ITransfer
  //         color={
  //           state.menuKey === "1"
  //             ? state?.paymentInfo?.customization?.buttonColor ?? "#006F01"
  //             : "#656565"
  //         }
  //         className={`h-8 w-8 p-2 rounded-full ${
  //           state.menuKey === "1" ? "bg-white" : "bg-[#F1F1F1]"
  //         }`}
  //       />
  //     ),
  //     content: <Transfer />,
  //   },

  //   {
  //     key: "5",
  //     label: (
  //       <div className="flex justify-between items-center">
  //         NQR{" "}
  //         {state.menuKey === "5" && (
  //           <img src={check} alt="" className="hidden" />
  //         )}
  //       </div>
  //     ),
  //     icon: (
  //       <INqr
  //         color={
  //           state.menuKey === "5"
  //             ? state?.paymentInfo?.customization?.buttonColor ?? "#006F01"
  //             : "#656565"
  //         }
  //         className={`h-8 w-8 p-2 rounded-full ${
  //           state.menuKey === "5" ? "bg-white" : "bg-[#F1F1F1]"
  //         }`}
  //       />
  //     ),
  //     content: <Nqr />,
  //   },
  //   {
  //     key: "3",
  //     label: (
  //       <div className="flex justify-between items-center">
  //         USSD{" "}
  //         {state.menuKey === "3" && (
  //           <img src={check} alt="" className="hidden" />
  //         )}
  //       </div>
  //     ),
  //     icon: (
  //       <IUssd
  //         color={
  //           state.menuKey === "3"
  //             ? state?.paymentInfo?.customization?.buttonColor ?? "#006F01"
  //             : "#656565"
  //         }
  //         className={`h-8 w-8 p-2 rounded-full ${
  //           state.menuKey === "3" ? "bg-white" : "bg-[#F1F1F1]"
  //         }`}
  //       />
  //     ),
  //     content: <Ussd />,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <div className="flex justify-between items-center">
  //         Card{" "}
  //         {state.menuKey === "2" && (
  //           <img src={check} alt="" className="hidden" />
  //         )}
  //       </div>
  //     ),
  //     icon: (
  //       <ICard
  //         color={
  //           state.menuKey === "2"
  //             ? state?.paymentInfo?.customization?.buttonColor ?? "#006F01"
  //             : "#656565"
  //         }
  //         className={`h-8 w-8 p-2 rounded-full ${
  //           state.menuKey === "2" ? "bg-white" : "bg-[#F1F1F1]"
  //         }`}
  //       />
  //     ),
  //     content: <Card />,
  //   },
  //   {
  //     key: "4",
  //     label: (
  //       <div className="flex justify-between items-center">
  //         Bank{" "}
  //         {state.menuKey === "4" && (
  //           <img src={check} alt="" className="hidden" />
  //         )}
  //       </div>
  //     ),
  //     icon: (
  //       <IBank
  //         color={
  //           state.menuKey === "4"
  //             ? state?.paymentInfo?.customization?.buttonColor ?? "#006F01"
  //             : "#656565"
  //         }
  //         className={`h-8 w-8 p-2 rounded-full ${
  //           state.menuKey === "4" ? "bg-white" : "bg-[#F1F1F1]"
  //         }`}
  //       />
  //     ),
  //     content: <Banks />,
  //   },
  // ].filter((item) => {
  //   if (state.paymentInfo?.currency?.toUpperCase() !== "NGN") {
  //     return (
  //       state.paymentInfo && state.paymentInfo.cardPayment && item.key === "2"
  //     );
  //   } else {
  //     return (
  //       (state.paymentInfo &&
  //         state.paymentInfo.cardPayment &&
  //         item.key === "2") ||
  //       (state.paymentInfo &&
  //         state.paymentInfo.ussdPayment &&
  //         item.key === "3") ||
  //       (state.paymentInfo &&
  //         state.paymentInfo.accountPayment &&
  //         item.key === "4") ||
  //       (state.paymentInfo &&
  //         state.paymentInfo.bankTransferPayment &&
  //         item.key === "1") ||
  //       (state.paymentInfo &&
  //         state.paymentInfo.qrPayment &&
  //         item.key === "5") ||
  //       (state.paymentInfo &&
  //         state.paymentInfo.walletPayment &&
  //         item.key === "6")
  //     );
  //   }
  // });

  return items;
};

export default useMenuItems;
