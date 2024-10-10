module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        19.5: "4.1rem", // 원하는 값을 설정
      },
      fontFamily: {
        custom: ["WavvePADO-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
