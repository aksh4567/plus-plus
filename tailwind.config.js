/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // 1. NEW NAMING (Future-proof)
                code: {
                    'bg-primary': "var(--color-bg-primary)",
                    'bg-secondary': "var(--color-bg-secondary)",
                    'bg-tertiary': "var(--color-bg-tertiary)",
                    'text-primary': "var(--color-text-primary)",
                    'text-secondary': "var(--color-text-secondary)",
                    border: "var(--color-border)",
                    accent: "var(--color-accent)",
                    'accent-hover': "var(--color-accent-hover)",
                    success: "var(--color-success)",
                    warning: "var(--color-warning)",
                    error: "var(--color-error)",
                },

                // 2. BACKWARDS COMPATIBILITY (Keeps existing code working)
                // This maps old 'lc' classes to the NEW CSS variables
                lc: {
                    body: "var(--color-bg-primary)",
                    layer1: "var(--color-bg-secondary)",
                    layer2: "var(--color-bg-tertiary)",
                    layer3: "var(--color-bg-tertiary)",
                    text: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                    border: "var(--color-border)",
                    yellow: "var(--color-accent)",
                    easy: "var(--color-success)",
                    medium: "var(--color-warning)",
                    hard: "var(--color-error)",
                },
            },
        },
    },
    plugins: [],
};
