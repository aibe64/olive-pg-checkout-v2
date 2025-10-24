import { ThemeConfig } from "antd";

export const getThemeConfig = (
  buttonColor: string | undefined,
  secondaryColor: string | undefined
): ThemeConfig => {
  return {
    token: {
      colorPrimary: "#006F01",
    },
    components: {
      Button: {
        colorPrimary: buttonColor ?? "#006F01",
        defaultHoverBg: buttonColor ?? "#006F01",
      },
      Menu: {
        itemSelectedBg: "#F3FAF4",
        itemSelectedColor: "#006F01",
        itemColor: "#656565",
        itemHoverColor: "#656565",
        itemHoverBg: secondaryColor ?? "#F3FAF4",
        subMenuItemBg: "#006F01",
        controlHeightLG: 55,
        itemBorderRadius: 0,
        itemMarginInline: 0,
        itemMarginBlock: 0,
        fontFamily: "inter-medium",
      },
      Select: {
        colorBgContainerDisabled: "#F5F6FA",
        colorTextDisabled: "#272848",
        lineWidthFocus: 0,
        controlOutlineWidth: 0,
        controlHeight: 45,
        fontFamily: "inter-regular",
        fontSize: 12,
        colorTextPlaceholder: "#656565",
        colorBorder: "#E8E8E8",
        colorPrimaryBorderHover: buttonColor ?? "#006F01",
        colorPrimary: buttonColor ?? "#006F01",
      },
      Checkbox: {
        colorPrimary: buttonColor ?? "#006F01",
      },
      Input: {
        lineHeight: 3,
        colorTextPlaceholder: "#656565",
        colorBorder: "#E8E8E8",
        activeBorderColor: buttonColor ?? "#006F01",
        fontFamily: "inter-regular",
        fontSize: 12,
        hoverBorderColor: buttonColor ?? "#006F01",
      },
    },
  };
};
