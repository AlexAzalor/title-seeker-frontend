import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // container: {
    //   center: true,
    //   padding: "2rem",
    //   screens: {
    //     "2xl": "1400px",
    //   },
    // },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: "#64fcfe",
        secondary: "#E4E9F2",
        surfaceSecondary: "#9d4eff",
        textPrimary: "#FFFFFF",
        buttonHover: "#69eafc",
        buttonHoverOutlined: "#b8ffe6",
        buttonDisabled: "#AFB3BA",
        cold1: "#b8ffe6",
        cold2: "#a4f4ef",
        cold3: "#8ef3f6",
        cold4: "#79f8fc",
        cold5: "#68fefe",
        cold6: "#64fcfe",
        cold7: "#69eafc",
        cold8: "#77c9fb",
        cold9: "#8796fb",
        cold10: "#976afc",
        cold11: "#9d4eff",

        fromScreen: "#68d6e6",

        Turquoise: "#40E0D0",
        Aqua: "#00FFFF",
        SkyBlue: "#87CEEB",
        Teal: "#008080",
        SeafoamGreen: "#90EE90",
        MintGreen: "#98FB98",
        Coral: "#FF7F50",
        Peach: "#FFDAB9",
        SalmonPink: "#FFA07A",
        Lavender: "#E6E6FA",
        Lilac: "#C8A2C8",
        Cream: "#FFFDD0",
        Sand: "#F4A460",
        Taupe: "#483C32",
        Gray: "#808080",
        White: "#FFFFFF",

        Maincolor: "#68fefe",
        White2: "#FFFFFF",
        LightGray: "#D3D3D3",
        LightBlue: "#ADD8E6",
        PaleGreen: "#98FB98",
        Lavender2: "#E6E6FA",
        Peach2: "#FFDAB9",
        LightYellow: "#FFFFE0",
        PalePink: "#FFD1DC",
        LightCoral: "#F08080",

        // Cyan
        Cyan: "#00FFFF",
        LightCyan: "#E0FFFF",
        AquaCyan: "#7FFFD4",
        MediumCyan: "#66CDAA",
        DarkCyan: "#008B8B",
        PaleCyan: "#AFEEEE",
        TurquoiseCyan: "#40E0D0",
        ElectricCyan: "#00FFFF",
        PowderCyan: "#B0E0E6",
        DeepCyan: "#00CED1",

        // From Screen
        MainColor1: "#68d6e6",
        MainColor2: "#FFFFFF",
        MainColor3: "#29589a",
        // additional
        LightGray2: "#f5f5f5",
        PaleBlue: "#c5e4ff",
        LightTurquoise: "#a0e6e6",
        SkyBlue2: "#87ceeb",
        LightCyan2: "#e0ffff",
        Silver: "#c0c0c0",
        SteelBlue: "#4682b4",

        // With pink
        MainColor11: "#68d6e6",
        MainColor22: "#FFFFFF",
        MainColor33: "#f1a4b6",
        // additional
        LightGray22: "#f5f5f5",
        PaleBlue2: "#c5e4ff",
        LightTurquoise2: "#a0e6e6",
        CoralPink: "#ff6b6b",
        Peach22: "#ffdab9",
        Lavender22: "#e6e6fa",
        Silver2: "#c0c0c0",

        MainColor111: "#7d729e",
        MainColor222: "#FFFFFF",
        MainColor333: "#d98a9c",
        MainColor444: "#ecceb7",
        // additional
        Lavender222: "#b19cd9",
        LightGray222: "#f5f5f5",
        PaleBlue22: "#c5e4ff",
        SoftPink: "#f5b7b1",
        LightPeach: "#ffdab9",
        Silver22: "#c0c0c0",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
