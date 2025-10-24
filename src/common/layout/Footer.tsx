import lock from "../../assets/icons/lock.svg";
import whiteLock from "../../assets/icons/white-lock.png";
import favicon from "../../../avatar.png";
import cbn from "../../assets/images/cbn.png";
import { useAppSelector } from "../../store/hooks";
import { isValidURL } from "../../utils/helper";

const Footer: React.FC = () => {
  const app = useAppSelector((state) => {
    return state.app;
  });
  return (
    <footer className="flex  items-center justify-center flex-wrap text-center gap-1 mt-3 mx-auto font-inter-medium md:hidden">
      <div className="flex items-center">
        <img
          src={
            window.self !== window.parent && window.innerWidth > 768
              ? whiteLock
              : lock
          }
          alt=""
          className="w-3 h-3"
        />
        <a
          href={
            isValidURL(app.paymentInfo?.customization?.footerLink)
              ? app.paymentInfo?.customization?.footerLink
              : "https://xpresspayments.com/"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            window.self !== window.parent
              ? "text-gray-text md:text-white"
              : "text-gray-text "
          } text-center tracking-wide text-[11px]`}
        >
          {app.paymentInfo?.customization?.footerText ??
            "Olive Payment Solutions Limited"}
        </a>
        <img
          src={
            app.paymentInfo?.customization?.footerLogo
              ? app.paymentInfo?.customization?.footerLogo
              : favicon
          }
          alt=""
          className="h-3 w-3 mx-1"
        />
      </div>
      <div className="flex gap-1 items-center">
        <span className="text-center tracking-wide text-[11px] text-gray-text">
          {" "}
          Licensed by the Central Bank of Nigeria
        </span>
        <img src={cbn} alt="" className="h-3 w-3 mx-1" />
      </div>
    </footer>
  );
};

export default Footer;
