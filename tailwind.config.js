/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "soft-green": "#FAFFF8",
        green: "#C1FDBB",
        "light-green": "#209B1E",
      },
      transitionProperty: {
        width: "width",
        all: "all",
      },
    },
  },
  plugins: [],
};
