import type {Config} from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                blueSky: "#C3EBFA",
                blueSkyLight: "#EDF9FD",
                customPurple: "#CFCEFF",
                customPurpleLight: "#F1F0FF",
                customYellow: "#FAE27C",
                customYellowLight: "#FEFCE8",
            },
        },
    },
    plugins: [],
} satisfies Config;
