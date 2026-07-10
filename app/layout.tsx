import type { Metadata } from "next"
import localFont from "next/font/local"
import { Fira_Code, IBM_Plex_Sans } from "next/font/google"
import "./globals.css"

const neueMontreal = localFont({
  src: [
    {
      path: "../public/fonts/PPNeueMontreal-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/PPNeueMontreal-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/PPNeueMontreal-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/PPNeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/PPNeueMontreal-SemiBolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/PPNeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
})

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
})

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const fontVariables = [
  neueMontreal.variable,
  ibmPlexSans.variable,
  firaCode.variable,
].join(" ")

const themeInitScript = `
(() => {
  const root = document.documentElement
  let choice = "system"

  try {
    const storedChoice = localStorage.getItem("theme-preference")
    if (storedChoice === "light" || storedChoice === "dark") {
      choice = storedChoice
    }
  } catch {}

  const effectiveTheme =
    choice === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : choice

  root.dataset.theme = effectiveTheme
  root.dataset.themeChoice = choice
})()
`

export const metadata: Metadata = {
  title: "Kevin On",
  description: "Kevin On's personal website",
  icons: {
    icon: "/profile.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
