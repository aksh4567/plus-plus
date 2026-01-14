"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function ClerkThemeProvider({ children }) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        // If the current theme is dark, use Clerk's dark theme
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: "#ffa116", // LeetCode Orange
          colorTextOnPrimaryBackground: "white",
        },
        elements: {
          // to further customize internal Clerk elements
          card: "shadow-none border border-lc-border",
          navbar: "hidden", //hides clerk's internal nav if needed
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
