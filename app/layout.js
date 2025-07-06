import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "サブスクリプション管理",
  description: "定期サブスクリプションサービスの管理・追跡・予算管理ができるアプリケーション",
  keywords: ["サブスクリプション", "管理", "予算", "定期支払い", "家計管理"],
  authors: [{ name: "Subscription Manager" }],
  creator: "Subscription Manager",
  publisher: "Subscription Manager",
  openGraph: {
    title: "サブスクリプション管理",
    description: "定期サブスクリプションサービスの管理・追跡・予算管理",
    type: "website",
    locale: "ja_JP",
  },
  robots: {
    index: false,
    follow: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
