import IClose from "../../assets/icons/IClose";
import arrowLeft from "../../assets/icons/arrow-left.svg";
import useApp from "../../hooks/useApp";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import SideBar from "../layout/SideBar";
import { ResponsePage } from "./ResponsePage";
import { getTextColor } from "../../utils/helper";

export const DesktopView = () => {
  const { onCancel, onCurrentChange, setHoverColor, state, items, hoverColor } = useApp(false);
  const currentItem = items.find((item) => item.key === state.menuKey);

  return (
    <>
      {" "}
      {state.current > 0 && (
        <button
          type="button"
          className="flex items-center gap-2 mb-3 border-none"
          onClick={() => onCurrentChange(state)}
        >
          <img src={arrowLeft} />
          <p className="text-gray-text font-inter-medium text-[13px]">Back</p>
        </button>
      )}
      
      <section className="hidden md:flex items-start gap-2">
        <div className="flex flex-col">
          {
            state.showResponsePage 
              ? (
                <ResponsePage
                  title={state.responseTitle}
                  description={state.responseDescription}
                  image={state.responseImage}
                  onClick={state.responseOnClick}
                  buttonName={state.responseBtnName}
                />
              ) 
              : (
                <div
                  className="w-[32rem] relative grid grid-cols-[10.5rem_1fr] border-[0.5px] border-disabled-gray card bg-white rounded-[8px] custom-text-color"
                  style={
                    {
                      backgroundColor: state.paymentInfo?.customization?.bodyColor,
                      "--custom-text-color": getTextColor(
                        state.paymentInfo?.customization?.bodyColor ?? ""
                      ),
                    } as React.CSSProperties
                  }
                >
                  <SideBar />
                  <main className="h-full">
                    <Header />
                    <div className="p-3">{currentItem?.content}</div>
                  </main>
                </div>
              )
          }
          <Footer />
        </div>

        <div className="hover:bg-red-600 close transition-opacity rounded-full w-4 h-4 flex items-center justify-between">
          <IClose
            onMouseEnter={() => setHoverColor("#ffffff")}
            onMouseLeave={() =>
              setHoverColor(
                "#656565"
              )
            }
            className="z-50"
            color={hoverColor}
            onClick={onCancel}
          />
        </div>
      </section>
    </>
  );
};
