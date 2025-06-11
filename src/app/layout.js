import { Geist, Geist_Mono } from "next/font/google"
import CheckSidebar from "../../components/CheckSidebar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Studify",
  description: "Your smart study partner",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen bg-black text-white">
          <CheckSidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}