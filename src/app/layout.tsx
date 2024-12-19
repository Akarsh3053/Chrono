import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/providers/theme-provider";

const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Chrono",
  description: "Automate your work with Chrono.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        //@ts-ignore
        layout: { unsafe_disableDevelopmentModeWarnings: true }
      }}>
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
