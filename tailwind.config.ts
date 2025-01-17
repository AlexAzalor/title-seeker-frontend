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
        // ========================

        //         primary: {
        //           light: '#F9E2E7', // Light Pink
        //           DEFAULT: '#F497A5', // Soft Pink
        //           dark: '#D6717E', // Deep Pink
        //         },
        //         secondary: {
        //           light: '#E1F5FE', // Light Blue
        //           DEFAULT: '#81D4FA', // Sky Blue
        //           dark: '#4BA3C7', // Medium Blue
        //         },
        //         neutral: {
        //           light: '#FAFAFA', // Off-White
        //           DEFAULT: '#EAEAEA', // Light Gray
        //           dark: '#9E9E9E', // Medium Gray
        //         },
        // // ========================

        //         primary: {
        //           light: '#FFC1E3', // Neon Pink
        //           DEFAULT: '#FF4081', // Hot Pink
        //           dark: '#C60055', // Deep Neon Pink
        //         },
        //         secondary: {
        //           light: '#80D8FF', // Neon Blue
        //           DEFAULT: '#00B0FF', // Electric Blue
        //           dark: '#005F8E', // Deep Neon Blue
        //         },
        //         neutral: {
        //           light: '#F5F5F5', // White Smoke
        //           DEFAULT: '#BDBDBD', // Gray
        //           dark: '#616161', // Charcoal
        //         },
        // // ========================

        //         primary: {
        //           light: '#EED9F5', // Pale Pink
        //           DEFAULT: '#D17BB8', // Blush Pink
        //           dark: '#9C4A7C', // Dusky Pink
        //         },
        //         secondary: {
        //           light: '#CCE7F9', // Pale Blue
        //           DEFAULT: '#6FA3CE', // Muted Blue
        //           dark: '#426A8A', // Steel Blue
        //         },
        //         neutral: {
        //           light: '#FFFFFF', // White
        //           DEFAULT: '#ECEFF1', // Light Gray
        //           dark: '#607D8B', // Blue-Gray
        //         },
        // // ========================
        //               primary: {
        //         light: '#FFD7F1', // Soft Blush Pink
        //         DEFAULT: '#FF92C6', // Bubblegum Pink
        //         dark: '#FF69A6', // Candy Pink
        //       },
        //       secondary: {
        //         light: '#D8EFFF', // Sky Pastel Blue
        //         DEFAULT: '#A3D8FF', // Baby Blue
        //         dark: '#71B7E6', // Soft Aqua Blue
        //       },
        //       accent: {
        //         light: '#FFF5C3', // Pale Yellow
        //         DEFAULT: '#FFE680', // Sunshine Yellow
        //         dark: '#FFCC33', // Golden Yellow
        //       },
        //       neutral: {
        //         light: '#FFF8FB', // Almost White Pink
        //         DEFAULT: '#FCE4EC', // Light Pink
        //         dark: '#F8BBD0', // Rosy Pink
        //       },

        //       // Anime 1
        //       primary: {
        //         light: '#FFD7F1', // Soft Blush Pink
        //         DEFAULT: '#FF92C6', // Bubblegum Pink
        //         dark: '#FF69A6', // Candy Pink
        //       },
        //       secondary: {
        //         light: '#D8EFFF', // Sky Pastel Blue
        //         DEFAULT: '#A3D8FF', // Baby Blue
        //         dark: '#71B7E6', // Soft Aqua Blue
        //       },
        //       accent: {
        //         light: '#FFF5C3', // Pale Yellow
        //         DEFAULT: '#FFE680', // Sunshine Yellow
        //         dark: '#FFCC33', // Golden Yellow
        //       },
        //       neutral: {
        //         light: '#FFF8FB', // Almost White Pink
        //         DEFAULT: '#FCE4EC', // Light Pink
        //         dark: '#F8BBD0', // Rosy Pink
        //       },

        //       // Anime 2

        //       primary: {
        //         light: '#FFE1E9', // Sakura Pink
        //         DEFAULT: '#FF99B7', // Cherry Blossom Pink
        //         dark: '#E06C9F', // Darker Pink Petal
        //       },
        //       secondary: {
        //         light: '#DCEFFF', // Soft Lavender Blue
        //         DEFAULT: '#A7CFFF', // Pastel Blue
        //         dark: '#6D9EDF', // Calm Blue
        //       },
        //       accent: {
        //         light: '#F7E3F5', // Pale Lilac
        //         DEFAULT: '#D5A9E5', // Lavender
        //         dark: '#A678C1', // Deep Orchid
        //       },
        //       neutral: {
        //         light: '#FFFFFF', // White
        //         DEFAULT: '#F7F7F7', // Off-White
        //         dark: '#EBEBEB', // Light Gray
        //       },

        // Anime 3
        animeprimary: {
          light: "#FFADF7", // Neon Pink
          DEFAULT: "#FF69C0", // Hot Pink
          dark: "#E633A0", // Fuchsia
        },
        animesecondary: {
          light: "#ADE5FF", // Bright Aqua Blue
          DEFAULT: "#66CCFF", // Electric Blue
          dark: "#3399FF", // Bold Sky Blue
        },
        animeaccent: {
          light: "#FFF4B3", // Bright Yellow
          DEFAULT: "#FFD700", // Neon Yellow
          dark: "#FFC300", // Deep Golden Yellow
        },
        animeneutral: {
          light: "#FFF9FA", // Light Peachy Pink
          DEFAULT: "#F8EFF3", // Pastel Gray
          dark: "#E0D1D8", // Soft Gray
        },

        // Anime 4
        testfour: {
          p: "#FAD7E8",
          b: "#ACCBEA",
          w: "#FDFDFE ",
          p2: "#F7A9C7",
          g: "#B0BCCD",
        },

        // Rose Quartz & Serenity
        rosequartz: "#F7CAC9",
        serenity: "#92A8D1",
        // Lavender
        lavender: "#E6E6FA",
        // Peach
        peach: "#FFE5B4",
        // Ivory
        ivory: "#FFFFF0",
        // Light Blue
        lightblue: "#ADD8E6",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom-gradient": `linear-gradient(
          to right,
          #D6D1FF,
          #B4AFFF,
          #938EFF,
          #726CFF,
          #4A3AFF,
          #4035E6,
          #362FCC,
          #2C29B2,
          #222399,
          #181D7F
        )`,
        // "linear-gradient(to bottom, rgba(74, 58, 255, 1), rgba(66, 53, 232, 1), rgba(59, 48, 210, 1), rgba(52, 43, 187, 1), rgba(45, 38, 165, 1), rgba(39, 31, 143, 1), rgba(33, 25, 121, 1), rgba(27, 18, 99, 1), rgba(21, 12, 77, 1), rgba(44, 0, 62, 1))",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 0.5s ease-out",
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
        progress: {
          "0%": {
            width: "0",
          },
          "100%": {
            width: "96px",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "form-layout": "0px 5px 16px rgba(8, 15, 52, 0.06)",
        "input-default": "0px 2px 6px rgba(19, 18, 66, 0.07)",
        "input-light-mode":
          "0px 4px 8px rgba(250, 250, 250, 0.06), 0px 1px 3px rgba(250, 250, 250, 250.04)",
        "neon-purple":
          "0 0 6px rgba(74, 58, 255, 0.6), 0 0 6px rgba(74, 58, 255, 0.5), 0 0 6px rgba(74, 58, 255, 0.4), 0 0 6px rgba(74, 58, 255, 0.3)",
        "dark-form-layout": "0px 21px 69px rgba(0, 0, 0, 0.29)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

// background: linear-gradient(to bottom,
//   #4A3AFF,
//   #4235E8,
//   #3B30D2,
//   #342BBB,
//   #2D26A5,
//   #271F8F,
//   #211979,
//   #1B1263,
//   #150C4D,
//   #2C003E
// );

// #252154
// Light Tones of #4A3AFF
// #726CFF
// A slightly brighter tone with more softness.
// #938EFF
// Noticeably lighter but still retains the vibrant bluish-purple.
// #B4AFFF
// A pastel-like tone, great for a softer palette.
// #D6D1FF
// Very light, almost a lavender hue.
// #F7F4FF
// Almost white, with a hint of bluish-purple.
// Dark Tones of #4A3AFF
// #4035E6
// A slightly deeper and richer tone.
// #362FCC
// Noticeably darker but retains the vibrancy.
// #2C29B2
// A deep and intense purple-blue.
// #222399
// Much darker, nearing indigo shades.
// #181D7F
// Extremely dark, a deep midnight blue.

// Gradient Transition Colors
// #4A3AFF (Default Color)
// Vibrant bluish-purple.
// #4235E8
// Slightly darker, more blue-dominant.
// #3B30D2
// A balanced deep blue-purple tone.
// #342BBB
// Rich purple, leaning darker.
// #2D26A5
// Deep indigo tone, with reduced brightness.
// #271F8F
// A dark, moody purple tone.
// #211979
// A dark blue with hints of purple.
// #1B1263
// Approaching indigo, very dark.
// #150C4D
// Almost blackened indigo with subtle color hints.
// #2C003E (Dark Purple/Indigo)
// The final deep, dark indigo.

// background: linear-gradient(
//   to right,
//   #F7F4FF,
//   #D6D1FF,
//   #B4AFFF,
//   #938EFF,
//   #726CFF,
//   #4A3AFF,
//   #4035E6,
//   #362FCC,
//   #2C29B2,
//   #222399,
//   #181D7F
// );
