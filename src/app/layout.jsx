import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import ClerkThemeProvider from "@/components/ClerkThemeProvider"; // Import the new wrapper
import "./globals.css";

export const metadata = {
  title: "Code++",
  icons: {
    icon: "/cpp-favicon-96.png",
  },
  description: "Practice coding problems with real-time execution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-code-bg-primary text-code-text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <Navbar />
            <main>{children}</main>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
