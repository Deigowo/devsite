import type { Metadata } from "next"
import { Raleway } from "next/font/google"
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import "./globals.css"

const raleway = Raleway({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-raleway"
})

export const metadata: Metadata = {
    title: "DEIGOWO",
    description: "fullstack LEARNER"
}

export default function RootLayout({ children }: {children: React.ReactNode }) {
    return (
        <html lang="en" className={raleway.variable}>
            <body className="antialiased">{children}</body>
        </html>
    )
}