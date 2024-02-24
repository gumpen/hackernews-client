import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main-content-color": "#f6f6ef",
        "yc-orange": "#ff6600",
        "content-gray": "#828282",
      },
      fontFamily: {
        body: ["Verdana", "Geneva", "sans-serif"],
      },
      fontSize: {
        "3xs": `${7 / 0.75 / 16}rem`,
        "2xs": `${8 / 0.75 / 16}rem`,
        // "3xs": [
        //   `${7 / 0.75 / 16}rem`,
        //   {
        //     lineHeight: `${(7 / 0.75 / 16) * 1.1}rem`,
        //     // letterSpacing: "-0.01em",
        //   },
        // ],
      },
    },
  },
  plugins: [],
};
export default config;
