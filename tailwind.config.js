module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonBeige: "#E5DFD8",
        statusRed: "#CE482A",
        "custom-yellow": "#FFC637" /** 국민은행 메인색 */,
        "light-yellow": "#FFEEB1" /** 연한색 */,
        "badge-txt-red": "#D96B53",
        "badge-bg-red": "#FBDCD5",
        "badge-txt-orange": "#E98225",
        "badge-bg-orange": "#FFE5BD",
        "badge-txt-yellow": "#F4C008",
        "badge-bg-yellow": "#FFEEB1",
        "badge-txt-green": "#5EDE13",
        "badge-bg-green": "#DBFDC7",
        "badge-txt-blue": "#139CE8",
        "badge-bg-blue": "#C1EAFF",
        "badge-txt-no": "#766C60",
        "badge-bg-no": "#E5DFD8",
        "badge-txt-yes": "#FEBE10",
        "badge-bg-yes": "#FFEAB1",
      },
    },
  },
  plugins: [],
};
