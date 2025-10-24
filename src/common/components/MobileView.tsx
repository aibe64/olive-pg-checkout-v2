import { Button } from "antd";
import IClose from "../../assets/icons/IClose";
import useApp from "../../hooks/useApp";
import Header from "../layout/Header";
import SideBar from "../layout/SideBar";
import { ResponsePage } from "./ResponsePage";
import PaymentMethod from "../../assets/icons/convert.svg";
import Footer from "../layout/Footer";

export const MobileView = ({}) => {
  const { onCancel, setshowPage, showPage, state, items } = useApp(false);
  const currentItem = items.find((item) => item.key === state.menuKey);
  return (
    <section className="flex flex-col md:hidden max-w-[23rem] w-full">
      <div className="bg-red-600 close transition-opacity rounded-full w-4 h-4 mb-2 flex items-center justify-center">
        <IClose color="#ffffff" className="z-50 ml-1" onClick={onCancel} />
      </div>
      {state.showResponsePage ? (
        <ResponsePage
          title={state.responseTitle}
          description={state.responseDescription}
          image={state.responseImage}
          onClick={state.responseOnClick}
          buttonName={state.responseBtnName}
        />
      ) : (
        <div className="bg-white rounded-[16px] px-3 pb-3 border border-gray-bg">
          <Header />
          {showPage ? (
            <div className="p-3">
              {currentItem?.content}
              <Button
                type="primary"
                style={{
                  background: state.paymentInfo?.customization?.buttonColor,
                  color: "white",
                }}
                className="shadow-none mx-auto mt-5 bg-[#F1F1F1] text-[#434343] border-[#E8E8E8] flex items-center justify-center p-6 font-inter-medium"
                onClick={() => setshowPage(false)}
                icon={<img src={PaymentMethod} alt="change-payment-method" />}
              >
                Change Payment Method
              </Button>
            </div>
          ) : (
            <div className="mx-5 rounded-[8px]">
              <SideBar />
              {/* <div className="mb-5">
                <Button
                  type="primary"
                  className="shadow-none flex items-center justify-center p-6 font-inter-medium"
                  block
                  onClick={() => setshowPage(true)}
                >
                  Make Payment
                </Button>
              </div> */}
            </div>
          )}
        </div>
      )}
      <Footer />
    </section>
  );
};
