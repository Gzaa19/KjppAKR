import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Background Colors
                'bg-1': 'var(--color-bg-1)',
                'bg-2': 'var(--color-bg-2)',
                'bg-primary': 'var(--color-bg-primary)',
                'bg-primary2': 'var(--color-bg-primary2)',
                'bg-green-5': 'var(--color-bg-green-5)',

                // Border Colors
                'border-primary': 'var(--color-border-primary)',
                'border-primary2': 'var(--color-border-primary2)',
                'border-hover': 'var(--color-border-hover)',

                // Text Colors
                'text-primary': 'var(--color-text-primary)',
                'text-primary2': 'var(--color-text-primary2)',
                'text-slate-1': 'var(--color-text-slate-1)',
                'text-slate-2': 'var(--color-text-slate-2)',
                'text-slate-3': 'var(--color-text-slate-3)',
                'text-slate-4': 'var(--color-text-slate-4)',
                'text-slate-5': 'var(--color-text-slate-5)',
                'text-slate-6': 'var(--color-text-slate-6)',
                'text-green-1': 'var(--color-text-green-1)',
                'text-green-2': 'var(--color-text-green-2)',
                'text-green-3': 'var(--color-text-green-3)',
                'text-green-4': 'var(--color-text-green-4)',
                'text-green-5': 'var(--color-text-green-5)',
                'text-green-6': 'var(--color-text-green-6)',

                // KJPP Brand Colors
                'kjpp-red': 'var(--color-kjpp-red)',
                'kjpp-dark': 'var(--color-kjpp-dark)',

                // Shadcn UI Colors
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
