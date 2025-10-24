import { useState, useEffect, useDeferredValue } from "react";

type DeviceType = "mobile" | "smaller_tablet" | "portrait_tablet" | "desktop";

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | undefined>();
  const deferredDeviceType = useDeferredValue(deviceType);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        setDeviceType("mobile");
      } else if (screenWidth <= 640) {
        setDeviceType("smaller_tablet");
      } else if (screenWidth <= 960) {
        setDeviceType("portrait_tablet");
      } else if (screenWidth <= 1025) {
        setDeviceType("portrait_tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    deviceType: deferredDeviceType,
    isMobile: deviceType === "mobile",
    isTablet:
      deviceType === "portrait_tablet" || deviceType === "smaller_tablet",
    isDesktop: deviceType === "desktop",
  };
};
