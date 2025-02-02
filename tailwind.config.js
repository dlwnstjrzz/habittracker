/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["SpoqaHanSansNeo-Regular"],
    },
    extend: {
      fontFamily: {
        thin: ["SpoqaHanSansNeo-Thin"],
        light: ["SpoqaHanSansNeo-Light"],
        regular: ["SpoqaHanSansNeo-Regular"],
        medium: ["SpoqaHanSansNeo-Medium"],
        bold: ["SpoqaHanSansNeo-Bold"],
      },
    },
  },
  plugins: [],
};
