module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonBeige: "#E5DFD8",
        statusRed: "#CE482A",
        "custom-yellow": "#FFC637" /** 국민은행 메인색 */,
        "light-yellow": "#FFEEB1" /** 연한색 */,
      },
    },
  },
  plugins: [],
};
