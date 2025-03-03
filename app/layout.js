import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UWSummit",
  description: "University of Waterloo's Secondary Job Board",
  icons: {
    icon: "/favicon.ico",
    apple: "/Group-4.png", // Optional for iOS
  },
  openGraph: {
    title: "UWSummit",
    description: "University of Waterloo's Secondary Job Board",
    url: 'https://www.uwsummit.ca/',
    siteName: 'UWSummit',
    images: [
      {
        url: 'https://www.uwsummit.ca/uwsummmitpreview.png', // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: 'UWSummit Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
