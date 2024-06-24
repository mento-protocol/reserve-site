import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      gridTemplateAreas: {
        "ratio-desktop": ["ratio unfrozen .", "info info ."],
        "ratio-mobile": ["unfrozen", "ratio", "info"],
        "holdings-desktop": [
          "celo celo celo",
          "unfrozen unfrozen frozen",
          "crypto crypto crypto",
          "btc eth dai",
        ],
        "holdings-mobile": [
          "celo",
          "unfrozen",
          "frozen",
          "crypto",
          "btc",
          "eth",
          "dai",
        ],
      },
      screens: {
        smallPhone: {
          max: "320px",
        },
        mediumPhone: {
          max: "420px",
        },
        phablet: {
          max: "500px",
        },
        smallTablet: {
          max: "590px",
        },
        tablet: {
          max: "890px",
        },
      },
      animation: {
        loading:
          "loading 1.4s ease-in-out infinite 20ms alternate-reverse none",
      },
      keyframes: {
        loading: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "0.4",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: { fg: ["var(--font-fg)"], inter: ["var(--font-inter)"] },
      spacing: {
        initial: "initial",
      },
      transitionTimingFunction: {
        "in-sine": "cubic-bezier(0.12, 0, 0.39, 0)",
        "out-sine": "cubic-bezier(0.61, 1, 0.88, 1)",
        "in-out-sine": "cubic-bezier(0.37, 0, 0.63, 1)",

        "in-quad": "cubic-bezier(0.11, 0, 0.5, 0)",
        "out-quad": "cubic-bezier(0.5, 1, 0.89, 1)",
        "in-out-quad": "cubic-bezier(0.45, 0, 0.55, 1)",

        "in-cubic": "cubic-bezier(0.32, 0, 0.67, 0)",
        "out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)",
        "in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",

        "in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",

        "in-quint": "cubic-bezier(0.64, 0, 0.78, 0)",
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)",

        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",

        "in-circ": "cubic-bezier(0.55, 0, 1, 0.45)",
        "out-circ": "cubic-bezier(0, 0.55, 0.45, 1)",
        "in-out-circ": "cubic-bezier(0.85, 0, 0.15, 1)",

        "in-back": "cubic-bezier(0.36, 0, 0.66, -0.56)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",

        "in-elastic": "cubic-bezier(0.36, 0.66, 0.04, 1.44)",
        "out-elastic": "cubic-bezier(0.6, -0.44, 0.96, 0.24)",
        "in-out-elastic": "cubic-bezier(0.78, 0.14, 0.15, 0.86)",

        "in-bounce": "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
        "out-bounce": "cubic-bezier(0.12, 0.84, 0.29, 1.16)",
        "in-out-bounce": "cubic-bezier(0.81, -0.44, 0.19, 1.44)",
      },
      transitionProperty: {
        transformOpacity: "transform, opacity",
      },
      colors: {
        reserve: {
          dark: "#333",
          gray: "#7A7A7A",
          gold: "#FECD4F",
          blue: "#5996d0",
          lightBlue: "#63c0eb",
          orange: "#f2a900",
          red: "#de806a",
          green: "#77D2A7",
          violet: "#BF97FF",
          purpleGray: "#716b94",
          darkolivegreen: "#556B2F",
        },
        primary: {
          light: "#4D62F0",
          DEFAULT: "#4D62F0",
          dark: "#2A326A",
        },
        secondary: {
          light: "#FCD7FC",
          DEFAULT: "#FCD7FC",
          dark: "#845F84",
        },
        "light-red": "#FF848A",
        "light-green": "#D2FCBF",
        success: {
          light: "#d2fcbd",
          DEFAULT: "#d2fcbd",
          dark: "#64805d",
        },
        error: {
          light: "#ff848a",
          DEFAULT: "#ff848a",
          dark: "#893e43",
        },
        warning: {
          light: "#f9fa96",
          DEFAULT: "#f9fa96",
          dark: "#878751",
        },
        info: {
          light: "#d5f0f6",
          DEFAULT: "#d5f0f6",
          dark: "#5c6c74",
        },
        black: {
          off: "#121316",
          DEFAULT: "#02010A",
        },
        white: "#FFFFFF",
        gray: {
          alt66: "#88888866", // Need to confirm where these 8 style ones came from
          lighter: "#CCCFDE",
          light: "#B3B3B3",
          DEFAULT: "#808080",
          regular: "#808080",
          dark: "#636366",
        },
        mento: {
          blue: "#4D62F0",
          cyan: "#A5E5F7",
          bright: "#F9FAA2",
          mint: "#D2FCBD",
          blush: "#FCD7FC",
          dark: "#02010A",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
