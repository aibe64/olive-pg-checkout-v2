/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.7s ease-in-out",
      },
      fontFamily: {
        "inter-bold": ["inter-bold"],
        "inter-semibold": ["inter-semibold"],
        "inter-medium": ["inter-medium"],
        "inter-regular": ["inter-regular"],
      },
      colors: {
        "primary-green": "#006F01",
        "primary-green-100": "#006F011A",
        "gray-text": "#656565",
        "orange-text": "#FF6D00",
        "disabled-gray": "#F1F1F1",
        "gray-bg": "#E8E8E8",
        danger: "#FF0000"
      },
      height: {
        screen: ["100svh"],
      },
    },
  },
  plugins: [],
};
